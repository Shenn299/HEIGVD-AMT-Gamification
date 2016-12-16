
package ch.heigvd.gamification.model;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

/**
 *
 * @author TCHUENSU
 */

@Entity
@DiscriminatorValue(value = "badgeAward")
public class BadgeAward extends Award implements Serializable{

    
    @ManyToOne
    private Badge badge;
    
    
     public BadgeAward() {
    }
   
     public BadgeAward(Badge badge, String reason, Date timestamp, User appUser){
         super(reason, timestamp, appUser);
         this.badge = badge;
     }

     
     public Badge getBadge() {
        return badge;
    }
     
    public void setBadge(Badge badge) {
        this.badge = badge;
    }
    
}