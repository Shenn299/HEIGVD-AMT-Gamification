/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package ch.heigvd.gamification.services;

import ch.heigvd.gamification.model.Application;
import ch.heigvd.gamification.model.Event;
import ch.heigvd.gamification.model.User;
import java.util.List;
import java.util.Objects;
import javax.transaction.Transactional;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * 
 * @author Sekley Pascal <pascal.sekley@heig-vd.ch>
 */
@Service
public class EventProcessor {
    
    private final UserRepository userRepository;
    
    public EventProcessor(UserRepository userRepository){
        this.userRepository = userRepository;
    }
    
  @Async
  @Transactional
public User processEvent(Application targetApplication, Event event) {
        Long idToMatch = null;
        User userInDb = null;
        List<User> listUsers = targetApplication.getListUsers();
       
        for (User user : listUsers) {
            idToMatch = user.getUserIdApp();//user.getId()
            if(Objects.equals(idToMatch, event.getUserAppid())){
                userInDb = user;
                break;
            }
        }
        // if the user is not in the database we add him
        if (userInDb == null) {
            // Create and save the user in the database
            userInDb = new User(targetApplication);
            userInDb.setUserIdApp(event.getUserAppid()); //idToMatch
            userInDb.setNumberOfEvents(1); // Because it's a new user
            userRepository.save(userInDb);
        }
        else{
            userInDb.setNumberOfEvents(userInDb.getNumberOfEvents()+1);
        }
        return userInDb;

    }

}
