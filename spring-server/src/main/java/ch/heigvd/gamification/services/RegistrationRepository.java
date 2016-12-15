
package ch.heigvd.gamification.services;

import ch.heigvd.gamification.model.Registration;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Sekley Pascal <pascal.sekley@heig-vd.ch>
 */
public interface RegistrationRepository extends JpaRepository<Registration, Long>{
    
    Registration findOne(long registrationId);
    Registration findByName(String name);
    List<Registration> findAll();
    
}
