
package ch.heigvd.gamification.services;


//import ch.heigvd.gamification.model.Badge;
import ch.heigvd.gamification.model.Badge;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.repository.CrudRepository;

/**
 *
 * @author Sekley Pascal <pascal.sekley@heig-vd.ch>
 */
public interface BadgeRepository extends JpaRepository<Badge, Long>{
    
    //List<Badge> findByName (String name);
    Badge findOne(long badgeId);
    List<Badge> findAll();
    
}
