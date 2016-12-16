/*
 -----------------------------------------------------------------------------------
 Project 	 : Gamification API
 File     	 : Application.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien  
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this class is to define an application and what its
                   caracteristics are.
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */

package ch.heigvd.gamification.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 * 
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien
 * @version 1.0
 * @since 2016-11-14
 */

@Entity
public class Application implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    private String name;
    private String description;
    
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private List<Badge> listBadges;
    
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private List<PointScale> listPointScales;
    
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private List<Event> listEvents;
    
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private List<User> listUsers;
    
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private List<Rule> listRules;
    
    public Application(){}
    
    public Application(String name, String description){
        this.name = name;
        this.description = description;
        listBadges = new ArrayList<>();
        listEvents = new ArrayList<>();
        listUsers = new ArrayList<>();
    }
    
    
    public List<Badge> getBadges(){
        return listBadges;
    }
    
    public List<Event> getEvents(){
        return listEvents;
    }
    
    
    public Long getId() {
        return id;
    }
   
    
    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    public void addEvent(Event newEvent){
        this.listEvents.add(newEvent);
    }
    
    public void addBadges(Badge badge){
        this.listBadges.add(badge);
    }
    
    public void addUsers(User user){
        this.listUsers.add(user);
    }
    
    public List<User> getListUsers(){
        return listUsers;
    }
    
    public List<Rule> getListRules(){
        return listRules;
    }
}
