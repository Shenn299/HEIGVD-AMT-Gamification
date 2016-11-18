package ch.heigvd.amt.gamification.rest;


import ch.heigvd.amt.gamification.model.Badge;
import ch.heigvd.amt.gamification.services.BadgeRepository;
import java.util.List;


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
import org.springframework.web.util.UriComponentsBuilder;



@RestController
@RequestMapping("/badges")
public class BadgeRestController {
    
        private final BadgeRepository badgeRepository;
    
    @Autowired
    BadgeRestController(BadgeRepository badgeRepository){
        this.badgeRepository = badgeRepository;
    }
    
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<Badge>> readBadges(){
        List<Badge> badges = this.badgeRepository.findAll();
        if(badges.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(badges, HttpStatus.OK);
    }
    
    
    @RequestMapping(method = RequestMethod.GET, value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Badge> readBadge(@PathVariable("id") Long id){
        Badge badge = badgeRepository.findOne(id);
        if(badge == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(badge, HttpStatus.OK);
    }
    
    /**
     *
     * @param inputBadge
     * @param ucBuilder
     * @return
     */
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Void> createBadge(@RequestBody Badge inputBadge, UriComponentsBuilder ucBuilder){
        
        // TO DO: We've got to check if the badge is not in the database before saving
        
//        if(badgeRepository){
//            return new ResponseEntity<Void>(HttpStatus.CONFLICT);
//        }
        //System.out.println("A User with name " + inputBadge.getName() + " is being created");
        badgeRepository.save(inputBadge);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/badges/{id}").buildAndExpand(inputBadge.getId()).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }
    
    
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Badge> updateBadge (@PathVariable("id") long badgeID, @RequestBody Badge badge){
        
        Badge currentBadge = badgeRepository.findOne(badgeID);
        
        if(currentBadge == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        currentBadge.setName(badge.getName());
        currentBadge.setDescription(badge.getDescription());
        currentBadge.setImage(badge.getImage());
        
        badgeRepository.save(currentBadge);
        return new ResponseEntity<>(currentBadge, HttpStatus.OK);
    }
    
    
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Badge> deleteUser(@PathVariable("id") long badgeID) {
        
        Badge currentBadge = badgeRepository.findOne(badgeID);
        
        if(currentBadge == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        badgeRepository.delete(badgeID);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    
    @RequestMapping(method = RequestMethod.DELETE)
     public ResponseEntity<Badge> deleteAllBadges() {
         badgeRepository.deleteAll();
         return new ResponseEntity<>(HttpStatus.NO_CONTENT);
     }
   
    
    
    
}
