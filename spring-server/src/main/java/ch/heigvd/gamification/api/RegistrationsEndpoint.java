/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : RegistrationEndPoint.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define a REST API on a registration
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.api;

import ch.heigvd.gamification.api.dto.LocationRegistration;
import ch.heigvd.gamification.api.dto.RegistrationInputDTO;
import ch.heigvd.gamification.api.dto.RegistrationOutputDTO;
import ch.heigvd.gamification.model.Registration;
import ch.heigvd.gamification.services.RegistrationRepository;
import ch.heigvd.gamification.services.TokenKeyTools;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien
 * @version 1.0
 * @since 2016-11-14
 */
@RestController
@RequestMapping("/registrations")
public class RegistrationsEndpoint implements RegistrationsApi {

   private final HttpServletRequest request;
   private final RegistrationRepository registrationRepository;

   @Autowired
   RegistrationsEndpoint(HttpServletRequest request, RegistrationRepository registrationRepository) {
      this.request = request;
      this.registrationRepository = registrationRepository;
   }

   @Override
   @RequestMapping(method = RequestMethod.GET)
   public ResponseEntity<List<RegistrationOutputDTO>> registrationsGet() {
      List<Registration> registrations = this.registrationRepository.findAll();
      List<RegistrationOutputDTO> registrationsDTO = new ArrayList<>();
      for (int i = 0; i < registrations.size(); i++) {
         registrationsDTO.add(i, toDTO(registrations.get(i)));
      }
      return new ResponseEntity<>(registrationsDTO, HttpStatus.OK);
   }

   @Override
   @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
   public ResponseEntity<Void> registrationsIdDelete(@PathVariable("id") Long id, @RequestHeader("Authorization") String token) {

      // Get the json web token from the Authorization HTTP header
      String jwtProvided = request.getHeader("Authorization");

      // Check if the JWT isn't valid
      if (!TokenKeyTools.jwtIsOk(jwtProvided)) {
         return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      // Check if application id contained in JWT doesn't equal the id provided
      if (!Objects.equals(TokenKeyTools.parseJWT(jwtProvided), id)) {
         return new ResponseEntity<>(HttpStatus.FORBIDDEN);
      }

      // Check if the registration id provided exists
      Registration currentRegistration = registrationRepository.findOne(id);
      if (currentRegistration == null) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

      registrationRepository.delete(id);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
   }

   @Override
   @RequestMapping(method = RequestMethod.GET, value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
   public ResponseEntity<RegistrationOutputDTO> registrationsIdGet(@PathVariable("id") Long id) {

      // Check if the registration id provided exists
      Registration registration = registrationRepository.findOne(id);
      if (registration == null) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

      RegistrationOutputDTO registrationDTO = toDTO(registration);

      return new ResponseEntity<>(registrationDTO, HttpStatus.OK);
   }

   @Override
   @RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
   public ResponseEntity<Void> registrationsIdPut(@PathVariable("id") Long id, @RequestHeader("Authorization") String token, @RequestBody RegistrationInputDTO registration) {

      // Check if the JWT isn't valid
      if (!TokenKeyTools.jwtIsOk(token)) {
         return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      // Check if application id contained in JWT doesn't equal the id provided
      if (!Objects.equals(TokenKeyTools.parseJWT(token), id)) {
         return new ResponseEntity<>(HttpStatus.FORBIDDEN);
      }

      // Check if the registration id provided exists
      Registration currentRegistration = registrationRepository.findOne(id);
      if (currentRegistration == null) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

      final String name = registration.getName();
      final String description = registration.getDescription();
      final String password = registration.getPassword();

      // Check if the request is processable
      boolean requestIsProcessable = requestIsProcessable(name, description, password);

      // Check if the application name has changed
      if (!currentRegistration.getName().equals(name)) {
         // Check if the application name provided already exist
         Registration registrationSaved = registrationRepository.findByName(name);
         if (registrationSaved != null) {
            requestIsProcessable = false;
         }
      }

      if (!requestIsProcessable) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }

      // Update the registration
      currentRegistration.setName(name);
      currentRegistration.setDescription(description);
      currentRegistration.setPassword(password);
      registrationRepository.save(currentRegistration);

      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
   }

   @Override
   @RequestMapping(method = RequestMethod.POST)
   public ResponseEntity<LocationRegistration> registrationsPost(@RequestBody RegistrationInputDTO registration) {

      final String name = registration.getName();
      final String description = registration.getDescription();
      final String password = registration.getPassword();

      // Check if the request is processable
      boolean requestIsProcessable = requestIsProcessable(name, description, password);

      // Check if the application name provided already exist
      Registration registrationSaved = registrationRepository.findByName(name);
      if (registrationSaved != null) {
         requestIsProcessable = false;
      }

      if (!requestIsProcessable) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }

      Registration newRegistration = fromDTO(registration);
      newRegistration = registrationRepository.save(newRegistration);
      Long newId = newRegistration.getId();
      
      StringBuffer location = request.getRequestURL();
      if (!location.toString().endsWith("/")) {
         location.append("/");
      }
      location.append(newId.toString());
      HttpHeaders headers = new HttpHeaders();
      headers.add("Location", location.toString());
      return new ResponseEntity<>(headers, HttpStatus.CREATED);
   }

   public RegistrationOutputDTO toDTO(Registration registration) {
      RegistrationOutputDTO dto = new RegistrationOutputDTO();
      dto.setRegistrationId(registration.getId());
      dto.setName(registration.getName());
      dto.setDescription(registration.getDescription());
      return dto;
   }

   public Registration fromDTO(RegistrationInputDTO registrationInputDTO) {
      return new Registration(registrationInputDTO.getName(), registrationInputDTO.getDescription(), registrationInputDTO.getPassword());
   }

   // Check if the payload json is processable
   public Boolean requestIsProcessable(String name, String description, String password) {

      // Test if the request isn't valid (http error 422 unprocessable entity)
      boolean requestIsProcessable = true;

      // Check if name, description or password is null
      if (name == null || description == null || password == null) {
         requestIsProcessable = false;
      }

      // Check if name, description or password is empty
      else if (name.trim().isEmpty() || description.trim().isEmpty() || password.trim().isEmpty()) {
         requestIsProcessable = false;
      }

      // Check if name or password length > 80 OR if description length > 255
      else if (name.length() > 80 || password.length() > 80 || description.length() > 255) {
         requestIsProcessable = false;
      }

      // Check if password contains at least 7 characters
      else if (password.length() < 7) {
         requestIsProcessable = false;
      }

      return requestIsProcessable;
   }

}
