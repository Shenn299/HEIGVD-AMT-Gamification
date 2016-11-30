/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package ch.heigvd.gamification.api;

import ch.heigvd.gamification.api.dto.BadgeInputDTO;
import ch.heigvd.gamification.api.dto.BadgeOutputDTO;
import ch.heigvd.gamification.api.dto.LocationBadge;
import ch.heigvd.gamification.model.Badge;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 
 * @author Sekley Pascal <pascal.sekley@heig-vd.ch>
 */
@RestController
@RequestMapping("/badges")
public class BadgesEndpoint implements BadgesApi{
    
    private final HttpServletRequest request;
    private final BadgeRepository badgeRepository;
    
    @Autowired
    BadgesEndpoint(HttpServletRequest request, BadgeRepository badgeRepository){
        this.request = request;
        this.badgeRepository = badgeRepository;
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<BadgeOutputDTO>> badgesGet() {
        List<Badge> badges = this.badgeRepository.findAll();
        if(badges.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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
        
        if (badge.getName() == null || badge.getDescription() == null || badge.getImageURL() == null) {
            return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
        }
        
        Badge currentBadge = badgeRepository.findOne(Long.valueOf(id));
        if(currentBadge == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        currentBadge.setName(badge.getName());
        currentBadge.setDescription(badge.getDescription());
        currentBadge.setImage(badge.getImageURL());
        
        badgeRepository.save(currentBadge);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Override
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<LocationBadge> badgesPost(@RequestBody BadgeInputDTO badge) {
        
        // TO DO: We've got to check if the badge is not in the database before saving
       if(badge.getName()==null || badge.getDescription()==null || badge.getImageURL()==null){
           
           return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
       }
        
        Badge newBadge = fromDTO(badge);
        newBadge = badgeRepository.save(newBadge);
        Long newId = newBadge.getId();
        String location =request.getRequestURL() +"/"+newId;
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Location", location);
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
