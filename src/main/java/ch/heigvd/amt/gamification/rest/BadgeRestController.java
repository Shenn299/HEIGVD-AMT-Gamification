package ch.heigvd.amt.gamification.rest;


import ch.heigvd.amt.gamification.model.Badge;
import ch.heigvd.amt.gamification.services.BadgeRepository;
import java.util.Collection;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


@RestController
@RequestMapping("/badges")
public class BadgeRestController {
    
        private final BadgeRepository badgeRepository;
    
    @Autowired
    BadgeRestController(BadgeRepository badgeRepository){
        this.badgeRepository = badgeRepository;
    }
   /* 
    @RequestMapping(method = RequestMethod.GET)
    Collection<Badge> readBadges(@PathVariable String name){
        return this.badgeRepository.findByName(name);
    }
    
    @RequestMapping(method = RequestMethod.GET, value = "/{badgeId}")
    Badge readBadge(@PathVariable String badgeId, @PathVariable Long badgeID){
        return this.badgeRepository.findOne(badgeID);
    }
    */
    
    /*
    @RequestMapping(method = RequestMethod.GET, value = "/{bookmarkId}")
    Badge readBadge(){
        return this.badgeRepository.findOne(exmpl)
    }
    */
    //ResponseEntity<?> add(@PathVariable String userId)
    
}
