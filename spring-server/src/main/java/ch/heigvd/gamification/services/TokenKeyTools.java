/*
 -----------------------------------------------------------------------------------
 Project 	 : Projet AMT
 File     	 : TokenKeyTools.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien 
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this file is to allow us to create a json web token, parse it
                   and verify if the json web token is well formed.
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.security.Key;
import java.util.Date;
import java.util.Properties;
import javax.crypto.spec.SecretKeySpec;

/**
 *
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien
 * @version 1.0
 * @since 2016-11-14
 */
public class TokenKeyTools {

   // File that contains the signature key to sign the JWT
   // For local deployment
   private static final String FILE_NAME = "src/main/resources/application.properties";
   // For Docker deployment
   //private static final String FILE_NAME = "config/config.properties";
   // Kind of authentication
   private static final String BEARER = "Bearer ";
   // Signature key to sign JWT
   private static final String ENCODED_KEY = readKey();

   // Read the signature key from application.properties file
   private static String readKey() {

      String key = "";
      Properties properties = new Properties();
      InputStream input;
      try {
         input = new FileInputStream(FILE_NAME);
      } catch (FileNotFoundException e) {
         System.out.println("Error, application.properties file not found !");
         return "";
      }

      try {
         // load the key
         properties.load(input);
         key = properties.getProperty("key");
      } catch (IOException e) {
         System.out.println("Error, key isn't readable from file !");
      } finally {
         try {
            input.close();
         } catch (IOException e) {
         }
      }

      return key;

   }

   // Construct a JWT
   // src: https://stormpath.com/blog/jwt-java-create-verify
   public static String createJWT(Long issuerId, long ttlMillis) {

      // The JWT signature algorithm we will be using to sign the token
      SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

      // We will sign our JWT with the signature key
      byte[] apiKeySecretBytes = ENCODED_KEY.getBytes();
      Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

      long nowMillis = System.currentTimeMillis();
      Date now = new Date(nowMillis);

      // Let's set the JWT Claims
      JwtBuilder builder = Jwts.builder()
              .setIssuedAt(now)
              .setIssuer(issuerId.toString())
              .signWith(signatureAlgorithm, signingKey);

      // if it has been specified, let's add the expiration
      if (ttlMillis >= 0) {
         long expMillis = nowMillis + ttlMillis;
         Date exp = new Date(expMillis);
         builder.setExpiration(exp);
      }

      // Builds the JWT and serializes it to a compact, URL-safe string
      return builder.compact();
   }

   // Return the application id contained in the JWT
   // Src: https://stormpath.com/blog/jwt-java-create-verify
   public static Long parseJWT(String jwt) throws MalformedJwtException, SignatureException, ExpiredJwtException {

      // Remove the Bearer pattern
      jwt = jwt.substring(BEARER.length(), jwt.length());

      // This line will throw an exception if it is not a signed JWS (as expected)
      Claims claims = Jwts.parser()
              .setSigningKey(ENCODED_KEY.getBytes())
              .parseClaimsJws(jwt).getBody();

      // Return the application id
      return Long.parseLong(claims.getIssuer());

   }

   // Check if the JWT is valid
   public static Boolean jwtIsOk(String jwt) {

      Boolean jtwIsOk = true;

      // Check if JWT is null or empty
      if (jwt == null || jwt.trim().isEmpty()) {
         jtwIsOk = false;
      }

      // Check if "Bearer" precedes the JWT
      else if (!jwt.startsWith(BEARER)) {
         jtwIsOk = false;
      }

      // Check synthax, signature and expiration time of the JWT and get the application id
      else {
         // Remove the Bearer pattern from JWT provided
         try {
            parseJWT(jwt);
         } catch (MalformedJwtException | SignatureException | ExpiredJwtException e) {
            jtwIsOk = false;
         }
      }
      return jtwIsOk;
   }
}
