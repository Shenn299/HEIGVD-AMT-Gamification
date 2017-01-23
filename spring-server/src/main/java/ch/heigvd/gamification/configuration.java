/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package ch.heigvd.gamification;

import ch.heigvd.gamification.api.ApiOriginFilter;
import javax.servlet.Filter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 *
 * @author seb
 */
@Configuration
public class configuration {

   @Bean
   public Filter toto() {
      return new ApiOriginFilter();
   }

}
