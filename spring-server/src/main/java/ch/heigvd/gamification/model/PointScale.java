

package ch.heigvd.gamification.model;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * 
 * @author Sekley Pascal <pascal.sekley@heig-vd.ch>
 */
@Entity
public class PointScale implements Serializable {

    //private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    private String name;
    //private String image;
    private String description;
    private int coefficient;

    public PointScale(){}
    
     public PointScale(String name, int coefficient, String description) {
        this.name = name;
        this.coefficient = coefficient;
        this.description = description;
    }

    public Long getId() {
        return id;
    }
   
    
    public String getName() {
        return name;
    }

//    public String getImage() {
//        return image;
//    }

    public int getCoefficient() {
        return coefficient;
    }
    
    

    public String getDescription() {
        return description;
    }

    public void setName(String name) {
        this.name = name;
    }

//    public void setImage(String image) {
//        this.image = image;
//    }

    public void setCoefficient(int coefficient) {
        this.coefficient = coefficient;
    }
    
    

    public void setDescription(String description) {
        this.description = description;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

}
