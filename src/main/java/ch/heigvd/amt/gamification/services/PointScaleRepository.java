/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ch.heigvd.amt.gamification.services;

import ch.heigvd.amt.gamification.model.PointScale;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Sekley Pascal <pascal.sekley@heig-vd.ch>
 */
public interface PointScaleRepository extends JpaRepository<PointScale, Long>{
    PointScale findOne (long pointScaleId);
    List <PointScale> findAll();

}
