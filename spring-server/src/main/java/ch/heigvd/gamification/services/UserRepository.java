/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ch.heigvd.gamification.services;

import ch.heigvd.gamification.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Sekley Pascal <pascal.sekley@heig-vd.ch>
 */
public interface UserRepository extends JpaRepository<User, Long>{
    
}
