/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : BadgesEndPoint.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define a REST API on a badge
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.api;

import ch.heigvd.gamification.api.dto.BadgeInputDTO;
import ch.heigvd.gamification.api.dto.BadgeOutputDTO;
import ch.heigvd.gamification.api.dto.LocationBadge;
import ch.heigvd.gamification.model.Application;
import ch.heigvd.gamification.model.Badge;
import ch.heigvd.gamification.services.ApplicationRepository;
import ch.heigvd.gamification.services.BadgeRepository;
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
@RequestMapping("/badges")
public class BadgesEndpoint implements BadgesApi{
    
    private final HttpServletRequest request;
    private final BadgeRepository badgeRepository;
    private final ApplicationRepository applicationRepository;
    
    
    
    @Autowired
    BadgesEndpoint(HttpServletRequest request, BadgeRepository badgeRepository, ApplicationRepository applicationRepository){
        this.request = request;
        this.badgeRepository = badgeRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<BadgeOutputDTO>> badgesGet() {
        
        List<Badge> badges = this.badgeRepository.findAll();

        List<BadgeOutputDTO> badgesDTO = new ArrayList<>();
        for (int i=0; i<badges.size(); i++){
            badgesDTO.add(i, toDTO(badges.get(i)));
        }
        return new ResponseEntity<>(badgesDTO, HttpStatus.OK); 
    }

    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> badgesIdDelete(@PathVariable("id")String id) {
        Badge currentBadge = badgeRepository.findOne(Long.valueOf(id));
        
        if(currentBadge == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        badgeRepository.delete(Long.valueOf(id));
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    @RequestMapping(method = RequestMethod.GET, value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BadgeOutputDTO> badgesIdGet(@PathVariable("id")String id) {
        Badge badge = badgeRepository.findOne(Long.valueOf(id));
        if(badge == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        BadgeOutputDTO badgeDTO = toDTO(badge);
        
        return new ResponseEntity<>(badgeDTO, HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/{id}",method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> badgesIdPut(@PathVariable("id")String id, @RequestBody BadgeInputDTO badge) {


        // Test if the request isn't valid (http error 422 unprocessable entity)
        boolean httpErrorUnprocessableEntity = false;

        // TODO: Check if the badge is already in this application before saving
        //Badge badgePosted = badgeRepository.findByName(badge.getName());
        // Check if name, description or imageURL is null
        if (badge.getName() == null || badge.getDescription() == null || badge.getImageURL() == null) {
            httpErrorUnprocessableEntity = true;
        } // Check if name, description or imageURL is empty
        else if (badge.getName().trim().isEmpty() || badge.getDescription().trim().isEmpty() || badge.getImageURL().trim().isEmpty()) {
            httpErrorUnprocessableEntity = true;
        } // Check if name length > 80 OR if description or imageURL length > 255
        else if (badge.getName().length() > 80 || badge.getDescription().length() > 255 || badge.getImageURL().length() > 255) {
            httpErrorUnprocessableEntity = true;
        }

        if (httpErrorUnprocessableEntity) {
            return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
        }

        Badge currentBadge = badgeRepository.findOne(Long.valueOf(id));
        if (currentBadge == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        currentBadge.setName(badge.getName());
        currentBadge.setDescription(badge.getDescription());
        currentBadge.setImage(badge.getImageURL());

        badgeRepository.save(currentBadge);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<LocationBadge> badgesPost(@RequestBody BadgeInputDTO badge, @RequestHeader Long applicationId) {
        
      Application application = applicationRepository.findOne(applicationId);
            
        
      // Test if the request isn't valid (http error 422 unprocessable entity)
      boolean httpErrorUnprocessableEntity = false;

      // Check if the badge is already in a given application
      if(badgeRepository.findByNameAndApplicationId(badge.getName(), applicationId) != null){
          httpErrorUnprocessableEntity = true;
      }
      
      // Check if name, description or imageURL is null
      if (badge.getName() == null || badge.getDescription() == null || badge.getImageURL() == null) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name, description or imageURL is empty
      else if (badge.getName().trim().isEmpty() || badge.getDescription().trim().isEmpty() || badge.getImageURL().trim().isEmpty()) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name length > 80 OR if description or imageURL length > 255
      else if (badge.getName().length() > 80 || badge.getDescription().length() > 255 || badge.getImageURL().length() > 255) {
         httpErrorUnprocessableEntity = true;
      }

      if (httpErrorUnprocessableEntity) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }

      Badge newBadge = fromDTO(badge);
      newBadge.setApplication(application);
      newBadge = badgeRepository.save(newBadge);
      Long newId = newBadge.getId();
      
      StringBuffer location = request.getRequestURL();
      if (!location.toString().endsWith("/")) {
         location.append("/");
      }
      location.append(newId.toString());
      HttpHeaders headers = new HttpHeaders();
      headers.add("Location", location.toString());
      return new ResponseEntity<>(headers, HttpStatus.CREATED);

        
    }
    
    
    public BadgeOutputDTO toDTO(Badge badge){
        BadgeOutputDTO dto = new BadgeOutputDTO();
        dto.setBadgeId(String.valueOf(badge.getId()));
        dto.setName(badge.getName());
        dto.setDescription(badge.getDescription());
        dto.setImageURL(badge.getImage());
        return dto;
    }
    
    public Badge fromDTO(BadgeInputDTO badgeInputDTO){
        return new Badge(badgeInputDTO.getName(), badgeInputDTO.getImageURL(), badgeInputDTO.getDescription());
    }

    

}
