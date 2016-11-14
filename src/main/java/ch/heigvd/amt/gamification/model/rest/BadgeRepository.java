
package ch.heigvd.amt.gamification.model.rest;


import ch.heigvd.amt.gamification.model.Badge;
import java.util.List;
import java.util.Optional;
import java.util.Collection;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.jpa.repository.JpaRepository;

//@RepositoryRestResource(collectionResourceRel = "badges", path = "badges")
public interface BadgeRepository extends JpaRepository<Badge, Long>{
    
    Collection<Badge> findByName(String name);
}
