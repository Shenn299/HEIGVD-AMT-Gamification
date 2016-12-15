/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ch.heigvd.gamification.api;

import ch.heigvd.gamification.api.dto.LocationPointScale;
import ch.heigvd.gamification.api.dto.PointScaleInputDTO;
import ch.heigvd.gamification.api.dto.PointScaleOutputDTO;
import ch.heigvd.gamification.model.PointScale;
import ch.heigvd.gamification.services.PointScaleRepository;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author TCHUENSU
 */
@RestController
@RequestMapping("/pointScales")
public class PointScalesEndpoint implements PointScalesApi {

   private final HttpServletRequest request;
   private final PointScaleRepository pointScaleRepository;

   @Autowired
   PointScalesEndpoint(HttpServletRequest request, PointScaleRepository pointScaleRepository) {
      this.pointScaleRepository = pointScaleRepository;
      this.request = request;
   }

   @Override
   @RequestMapping(method = RequestMethod.GET)
   public ResponseEntity<List<PointScaleOutputDTO>> pointScalesGet() {
      List<PointScale> pointScales = this.pointScaleRepository.findAll();
      List<PointScaleOutputDTO> pointScalesDTO = new ArrayList<>();
      for (int i = 0; i < pointScales.size(); i++) {
         pointScalesDTO.add(i, toDTO(pointScales.get(i)));
      }
      return new ResponseEntity<>(pointScalesDTO, HttpStatus.OK);

   }

   @Override
   @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
   public ResponseEntity<Void> pointScalesIdDelete(@PathVariable("id") String id) {

      PointScale currentPointScale = pointScaleRepository.findOne(Long.valueOf(id));

      if (currentPointScale == null) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

      pointScaleRepository.delete(Long.valueOf(id));
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);

   }

   @Override
   @RequestMapping(method = RequestMethod.GET, value = "/{id}")
   public ResponseEntity<PointScaleOutputDTO> pointScalesIdGet(@PathVariable("id") String id) {

      PointScale pointScale = pointScaleRepository.findOne(Long.valueOf(id));
      if (pointScale == null) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      PointScaleOutputDTO pointScaleDTO = toDTO(pointScale);

      return new ResponseEntity<>(pointScaleDTO, HttpStatus.OK);
   }

   @Override
   @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
   public ResponseEntity<Void> pointScalesIdPut(@PathVariable("id") String id, @RequestBody PointScaleInputDTO pointScale) {

      // Test if the request isn't valid (http error 422 unprocessable entity)
      boolean httpErrorUnprocessableEntity = false;

      // TODO: Check if the pointScale name is already in this application   
      // Check if name, description or coefficient is null
      if (pointScale.getName() == null || pointScale.getDescription() == null || pointScale.getCoefficient() == null) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name or description is empty
      else if (pointScale.getName().trim().isEmpty() || pointScale.getDescription().trim().isEmpty()) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name length > 80 OR if description length > 255 OR if coefficient > 1000 OR if coefficient < 1
      else if (pointScale.getName().length() > 80 || pointScale.getDescription().length() > 255 || pointScale.getCoefficient() > 1000 || pointScale.getCoefficient() < 1) {
         httpErrorUnprocessableEntity = true;
      }

      if (httpErrorUnprocessableEntity) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }

      PointScale currentPointScale = pointScaleRepository.findOne(Long.valueOf(id));
      if (currentPointScale == null) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      currentPointScale.setName(pointScale.getName());
      currentPointScale.setDescription(pointScale.getDescription());
      currentPointScale.setCoefficient(pointScale.getCoefficient());

      pointScaleRepository.save(currentPointScale);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);

   }

   @Override
   @RequestMapping(method = RequestMethod.POST)
   public ResponseEntity<LocationPointScale> pointScalesPost(@RequestBody PointScaleInputDTO pointScale) {

      // Test if the request isn't valid (http error 422 unprocessable entity)
      boolean httpErrorUnprocessableEntity = false;

      // TODO: Check if the pointScale name is already in this application    
      // Check if name, description or coefficient is null
      if (pointScale.getName() == null || pointScale.getDescription() == null || pointScale.getCoefficient() == null) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name OR description is empty
      else if (pointScale.getName().trim().isEmpty() || pointScale.getDescription().trim().isEmpty()) {
         httpErrorUnprocessableEntity = true;
      }

      // Check if name length > 80 OR if description length > 255 OR if coefficient > 1000 OR if coefficient < 1
      else if (pointScale.getName().length() > 80 || pointScale.getDescription().length() > 255 || pointScale.getCoefficient() > 1000 || pointScale.getCoefficient() < 1) {
         httpErrorUnprocessableEntity = true;
      }

      if (httpErrorUnprocessableEntity) {
         return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
      }

      PointScale newPointScale = fromDTO(pointScale);
      newPointScale = pointScaleRepository.save(newPointScale);
      Long newId = newPointScale.getId();
      
      StringBuffer location = request.getRequestURL();
      if (!location.toString().endsWith("/")) {
         location.append("/");
      }
      location.append(newId.toString());
      HttpHeaders headers = new HttpHeaders();
      headers.add("Location", location.toString());
      return new ResponseEntity<>(headers, HttpStatus.CREATED);

   }

   public PointScaleOutputDTO toDTO(PointScale pointScale) {
      PointScaleOutputDTO pointScaleDTO = new PointScaleOutputDTO();
      pointScaleDTO.setPointScaleId(String.valueOf(pointScale.getId()));
      pointScaleDTO.setName(pointScale.getName());
      pointScaleDTO.setCoefficient(pointScale.getCoefficient());
      pointScaleDTO.setDescription(pointScale.getDescription());
      return pointScaleDTO;
   }

   public PointScale fromDTO(PointScaleInputDTO badgeInputDTO) {
      return new PointScale(badgeInputDTO.getName(), badgeInputDTO.getCoefficient(), badgeInputDTO.getDescription());
   }
}
