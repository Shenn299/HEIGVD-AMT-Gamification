
package ch.heigvd.amt.gamification.model;



import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;


@Entity
public class Badge {
    
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    
    private String name;
    private String image;
    private String description;

    public Badge(){}

    public Badge(String name, String image, String descriotion) {
        this.name = name;
        this.image = image;
        this.description = descriotion;
    }

    public long getId() {
        return id;
    }
   
    
    public String getName() {
        return name;
    }

    public String getImage() {
        return image;
    }

    public String getDescription() {
        return description;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    
}
