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

            String location = request.getRequestURL() + "/" + newEvent.getId();
            HttpHeaders headers = new HttpHeaders();
            headers.add("Location", location);
            return new ResponseEntity<>(headers, HttpStatus.CREATED);
        }

    }

}
