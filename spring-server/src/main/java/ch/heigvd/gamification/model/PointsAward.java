/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package ch.heigvd.gamification.model;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

/**
 * 
 * @author Sekley Pascal <pascal.sekley@heig-vd.ch>
 */
@Entity
@DiscriminatorValue(value = "pointAward")
public class PointsAward extends Award implements Serializable {
    
    private long score;
        
    
    @ManyToOne
    private PointScale pointScale;
    
    public PointsAward() {}
    
    public PointsAward(PointScale pointScale, String reason, Date timestamp, User appUser){
         super(reason, timestamp, appUser);
         this.pointScale = pointScale;
     }

     
     public PointScale getPointScale() {
        return pointScale;
    }
     
    public void setPointScale(PointScale pointScale) {
        this.pointScale = pointScale;
    }
    
    public void setScore(long score){
        this.score = score;
    }
    
    public long getScore(){
        return score;
    }

}
