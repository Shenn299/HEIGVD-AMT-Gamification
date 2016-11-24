

package ch.heigvd.amt.gamification.rest;

import ch.heigvd.amt.gamification.model.PointScale;
import ch.heigvd.amt.gamification.services.PointScaleRepository;
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

/**
 * 
 * @author Sekley Pascal <pascal.sekley@heig-vd.ch>
 */

@RestController
@RequestMapping("/pointScales")
public class PointScaleRestController {
    
    private final PointScaleRepository pointScaleRepository;
    
    @Autowired
    PointScaleRestController(PointScaleRepository pointScaleRepository){
        this.pointScaleRepository = pointScaleRepository;
    }
    
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<PointScale>> readPointScale(){
        List<PointScale> pointScale = this.pointScaleRepository.findAll();
        if(pointScale.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(pointScale, HttpStatus.OK);
    }
    
    @RequestMapping(method = RequestMethod.GET, value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PointScale> readBadge(@PathVariable("id") Long id){
        PointScale badge = pointScaleRepository.findOne(id);
        if(badge == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(badge, HttpStatus.OK);
    }
    
    /**
     *
     * @param inputPointScale
     * @param ucBuilder
     * @return
     */
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Void> createPointScale(@RequestBody PointScale inputPointScale, UriComponentsBuilder ucBuilder){
        
        // TO DO: We've got to check if the badge is not in the database before saving
        
//        if(pointScaleRepository.findOne(inputPointScale.getId() == true)){
//            return new ResponseEntity<>(HttpStatus.CONFLICT);
//        }
        pointScaleRepository.save(inputPointScale);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/pointScales/{id}").buildAndExpand(inputPointScale.getId()).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }
    
    
       @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<PointScale> updatePointScale (@PathVariable("id") long pointScaleID, @RequestBody PointScale pointScale){
        
        PointScale currentPointScale = pointScaleRepository.findOne(pointScaleID);
        
        if(currentPointScale == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        currentPointScale.setName(pointScale.getName());
        currentPointScale.setDescription(pointScale.getDescription());
        currentPointScale.setImage(pointScale.getImage());
        
        pointScaleRepository.save(currentPointScale);
        return new ResponseEntity<>(currentPointScale, HttpStatus.OK);
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<PointScale> deleteUser(@PathVariable("id") long pointScaleID) {
        
        PointScale currentPointScale = pointScaleRepository.findOne(pointScaleID);
        
        if(currentPointScale == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        pointScaleRepository.delete(pointScaleID);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @RequestMapping(method = RequestMethod.DELETE)
     public ResponseEntity<PointScale> deleteAllBadges() {
         pointScaleRepository.deleteAll();
         return new ResponseEntity<>(HttpStatus.NO_CONTENT);
     }
     

}


