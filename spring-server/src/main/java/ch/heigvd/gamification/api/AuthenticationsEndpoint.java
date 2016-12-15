
package ch.heigvd.gamification.api;

import ch.heigvd.gamification.api.dto.AuthenticationInputDTO;
import ch.heigvd.gamification.model.Registration;
import ch.heigvd.gamification.services.RegistrationRepository;
import ch.heigvd.gamification.services.TokenKeyTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author seb
 */
@RestController
@RequestMapping("/authentications")
public class AuthenticationsEndpoint implements AuthenticationsApi {

   private final RegistrationRepository registrationRepository;

   @Autowired
   AuthenticationsEndpoint(RegistrationRepository registrationRepository) {
      this.registrationRepository = registrationRepository;
   }

   @Override
   @RequestMapping(method = RequestMethod.POST)
   public ResponseEntity<String> authenticationsPost(@RequestBody AuthenticationInputDTO authentication) {

      // Check if mandatory fields are provided
      if (authentication.getName() == null || authentication.getPassword() == null) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }

      // Get saved credentials
      Registration registration = registrationRepository.findByName(authentication.getName());

      // Check if application name provided doesn't exist or if credentials provided aren't correct
      if (registration == null || !authentication.getPassword().equals(registration.getPassword())) {
         return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      // Application id to add in the JWT
      Long applicationId = registration.getId();

      // Create the Json Web token with a ttl equals to 1 hour
      String tokenGenerated = TokenKeyTools.createJWT(applicationId, 3600000);
      System.out.println(tokenGenerated);

      // Return the Json Web Token into the HTTP body
      return new ResponseEntity<>(tokenGenerated, HttpStatus.OK);
   }

}
