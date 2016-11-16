
package ch.heigvd.amt.gamification;

import ch.heigvd.amt.gamification.model.Badge;
import ch.heigvd.amt.gamification.services.BadgeRepository;
import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;


@SpringBootApplication
public class RestApplication {
    
    public static void main(String[] args) {
		SpringApplication.run(RestApplication.class, args);
	}
    
    @Bean
    CommandLineRunner init(BadgeRepository badgeRepository){
        return (args) -> Arrays.asList(
                "HardWorking,Brave".split(","))
                .forEach(
                        a ->{
                            badgeRepository.save(new Badge("test1" + a, "img" + a, "A description"));
                        });
    } 
    
}


//@Component
//class BadgeCommandLinerunner implements CommandLineRunner{
//    @Override
//    public void run(String... args) throws Exception{
//        
//    }
//}