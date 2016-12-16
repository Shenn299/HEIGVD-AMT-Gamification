/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package ch.heigvd.gamification.api;

import ch.heigvd.gamification.api.dto.EventInputDTO;
import ch.heigvd.gamification.api.dto.LocationEvent;
import ch.heigvd.gamification.model.Application;
import ch.heigvd.gamification.model.Event;
import ch.heigvd.gamification.model.User;
import ch.heigvd.gamification.services.ApplicationRepository;
import ch.heigvd.gamification.services.EventProcessor;
import ch.heigvd.gamification.services.UserRepository;
import ch.heigvd.gamification.services.EventRepository;
import ch.heigvd.gamification.services.RuleProcessor;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 
 * @author Sekley Pascal <pascal.sekley@heig-vd.ch>
 */
@RestController
@RequestMapping("/events")
public class EventsEndpoint implements EventsApi{
    
    private final EventRepository eventRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final HttpServletRequest request;
    private final EventProcessor eventProcessor;
    private final RuleProcessor ruleProcessor;
    
    @Autowired
    EventsEndpoint(HttpServletRequest request, 
                    EventRepository eventRepository, 
                    ApplicationRepository applicationRepository,
                    UserRepository userRepository,
                    EventProcessor eventProcessor,
                    RuleProcessor ruleProcessor){
        
        this.request = request;
        this.eventRepository = eventRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.eventProcessor = eventProcessor;
        this.ruleProcessor = ruleProcessor;
    }

    @Override
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<LocationEvent> eventsPost(@RequestBody EventInputDTO event) {
        
       // Test if the request isn't valid (http error 422 unprocessable entity)
          boolean httpErrorUnprocessableEntity = false;
        
        
      // Check if name, description is null
      if (event.getName() == null || event.getDescription() == null) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name, description is empty
      else if (event.getName().trim().isEmpty() || event.getDescription().trim().isEmpty()) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name length > 80 OR if description length > 255
      else if (event.getName().length() > 80 || event.getDescription().length() > 255) {
         httpErrorUnprocessableEntity = true;
      }

      if (httpErrorUnprocessableEntity) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }
        

        Application targetApplication = applicationRepository.findOne(event.getApplicationId());
        Long userAppId = event.getUserAppId();
        if (targetApplication == null || userAppId == null) {
            return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
        }
        else{
            Event newEvent = new Event();
            User userInDb;
            newEvent.setName(event.getName());
            newEvent.setDescription(event.getDescription());
            newEvent.setUserAppId(event.getUserAppId());
            newEvent.setApplication(targetApplication);
            userInDb = eventProcessor.processEvent(targetApplication, newEvent);
            newEvent.setUser(userInDb);
            
            //Process the event with the user
            ruleProcessor.processRule(newEvent);
            
            // Save the new event in the database
            eventRepository.save(newEvent);
            Long newId = newEvent.getId();
            
            StringBuffer location = request.getRequestURL();
            if (!location.toString().endsWith("/")) {
                location.append("/");
            }
            location.append(newId.toString());
            HttpHeaders headers = new HttpHeaders();
            headers.add("Location", location.toString());
            return new ResponseEntity<>(headers, HttpStatus.CREATED);
        }

    }

}
