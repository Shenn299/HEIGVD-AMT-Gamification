
package ch.heigvd.gamification.services;


import ch.heigvd.gamification.model.PointScale;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author TCHUENSU
 */
public interface PointScaleRepository extends JpaRepository<PointScale, Long> {
    //List<Badge> findByName (String name);
    PointScale findOne(long badgeId);
    List<PointScale> findAll();
    
}
