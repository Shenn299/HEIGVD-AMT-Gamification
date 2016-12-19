/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : ApplicationEndPoint.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define a REST API on an application
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.api;

import ch.heigvd.gamification.api.dto.ApplicationInputDTO;
import ch.heigvd.gamification.api.dto.ApplicationOutputDTO;
import ch.heigvd.gamification.api.dto.BadgeOutputDTO;
import ch.heigvd.gamification.api.dto.LocationApplication;
import ch.heigvd.gamification.model.Application;
import ch.heigvd.gamification.model.Badge;
import ch.heigvd.gamification.services.ApplicationRepository;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
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
@RequestMapping("/applications")
public class ApplicationsEndpoint implements ApplicationsApi{
    
    private final ApplicationRepository applicationRepository;
    private final HttpServletRequest request;
    
    @Autowired
    ApplicationsEndpoint(HttpServletRequest request, ApplicationRepository applicationRepository){ 
        this.request = request;
        this.applicationRepository = applicationRepository;
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<ApplicationOutputDTO>> applicationsGet() {
        List<Application> applications = this.applicationRepository.findAll();

        List<ApplicationOutputDTO> applicationsDTO = new ArrayList<>();
        for (int i=0; i<applications.size(); i++){
            applicationsDTO.add(i, toDTO(applications.get(i)));
        }
        return new ResponseEntity<>(applicationsDTO, HttpStatus.OK); 
    }

    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> applicationsIdDelete(@PathVariable("id")String id) {
        
        Application currentApplication = applicationRepository.findOne(Long.valueOf(id));
        
        if(currentApplication == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        applicationRepository.delete(Long.valueOf(id));
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    @RequestMapping(method = RequestMethod.GET, value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApplicationOutputDTO> applicationsIdGet(@PathVariable("id")String id) {
        Application application = applicationRepository.findOne(Long.valueOf(id));
        if(application == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        ApplicationOutputDTO applicationDTO = toDTO(application);
        
        return new ResponseEntity<>(applicationDTO, HttpStatus.OK);
    }
    
    
    @Override
    @RequestMapping(method = RequestMethod.GET, value = "/{id}/badges", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BadgeOutputDTO>> applicationsIdBadgesGet(@PathVariable Long id) {
        Application application = applicationRepository.findOne(id);
         List<Badge> listBadges = application.getBadges();
         List<BadgeOutputDTO> badgesDTO = new ArrayList<>();
        for (int i=0; i<listBadges.size(); i++){
            badgesDTO.add(i, toDTO(listBadges.get(i)));
        }
        return new ResponseEntity<>(badgesDTO, HttpStatus.OK); 
        
    }
    

    

    @Override
    @RequestMapping(value = "/{id}",method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> applicationsIdPut(@PathVariable("id")String id, ApplicationInputDTO application) {

        
        // Test if the request isn't valid (http error 422 unprocessable entity)
        boolean httpErrorUnprocessableEntity = false;

        // TODO: Check if the application is already in this application before saving
        
        // Check if name, description or imageURL is null
        if (application.getName() == null || application.getDescription() == null) {
            httpErrorUnprocessableEntity = true;
        } 
        // Check if name, description or imageURL is empty
        else if (application.getName().trim().isEmpty() || application.getDescription().trim().isEmpty()) {
            httpErrorUnprocessableEntity = true;
        } 
        // Check if name length > 80 OR if description or imageURL length > 255
        else if (application.getName().length() > 80 || application.getDescription().length() > 255) {
            httpErrorUnprocessableEntity = true;
        }

        if (httpErrorUnprocessableEntity) {
            return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
        }

        Application currentApplication = applicationRepository.findOne(Long.valueOf(id));
        if(currentApplication == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        currentApplication.setName(application.getName());
        currentApplication.setDescription(application.getDescription());
        
        applicationRepository.save(currentApplication);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<LocationApplication> applicationsPost(@RequestBody ApplicationInputDTO application) {
        
        // TO DO: We've got to check if the app is not in the database before saving

       // Test if the request isn't valid (http error 422 unprocessable entity)
          boolean httpErrorUnprocessableEntity = false;
          
      // Check if the pointScale is already in a given application
      if(applicationRepository.findByName(application.getName()) != null){
          httpErrorUnprocessableEntity = true;
      }
        
        
      // Check if name, description or imageURL is null
      if (application.getName() == null || application.getDescription() == null) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name, description or imageURL is empty
      else if (application.getName().trim().isEmpty() || application.getDescription().trim().isEmpty()) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name length > 80 OR if description or imageURL length > 255
      else if (application.getName().length() > 80 || application.getDescription().length() > 255) {
         httpErrorUnprocessableEntity = true;
      }

      if (httpErrorUnprocessableEntity) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }

      Application newApplication = fromDTO(application);
      newApplication = applicationRepository.save(newApplication);
      Long newId = newApplication.getId();
      
      StringBuffer location = request.getRequestURL();
      if (!location.toString().endsWith("/")) {
         location.append("/");
      }
      location.append(newId.toString());
      HttpHeaders headers = new HttpHeaders();
      headers.add("Location", location.toString());
      return new ResponseEntity<>(headers, HttpStatus.CREATED);
        
    }
    
    public ApplicationOutputDTO toDTO(Application application){
        ApplicationOutputDTO dto = new ApplicationOutputDTO();
        dto.setApplicationId(application.getId());//String.valueOf(application.getId()
        dto.setName(application.getName());
        dto.setDescription(application.getDescription());
        return dto;
    }
    
    public BadgeOutputDTO toDTO(Badge badge){
        BadgeOutputDTO dto = new BadgeOutputDTO();
        dto.setBadgeId(String.valueOf(badge.getId()));
        dto.setName(badge.getName());
        dto.setDescription(badge.getDescription());
        dto.setImageURL(badge.getImage());
        return dto;
    }
    
    public Application fromDTO(ApplicationInputDTO applicationInputDTO){
        return new Application(applicationInputDTO.getName(), applicationInputDTO.getDescription());
    }

}
