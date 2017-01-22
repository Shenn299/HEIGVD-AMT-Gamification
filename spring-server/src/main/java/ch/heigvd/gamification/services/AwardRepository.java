/*
 -----------------------------------------------------------------------------------
 Project 	 : Projet AMT
 File     	 : AwardRepository.java
 Author(s)       : Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien 
 Date            : Start: 14.11.16 - End:  
 Purpose         : The goal of this file is to allow us to perform various operations, 
                   define a custom of some queries involving Award objects
 remark(s)       : n/a
 Compiler        : jdk 1.8.0_101
 -----------------------------------------------------------------------------------
 */
package ch.heigvd.gamification.services;

import ch.heigvd.gamification.model.Award;
import ch.heigvd.gamification.model.Badge;
import ch.heigvd.gamification.model.BadgeAward;
import ch.heigvd.gamification.model.PointScale;
import ch.heigvd.gamification.model.PointsAward;
import ch.heigvd.gamification.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini Fabien
 * @version 1.0
 * @since 2016-11-14
 */
public interface AwardRepository extends JpaRepository<Award, Long>{
    BadgeAward findByUserAndBadge(User user, Badge badge);
    
    PointsAward findByUserAndPointScale(User user, PointScale pointScale);
    
    List<Award> findByUserAndAppId(User user, Long appId);

    @Query("SELECT a fROM Award a WHERE a.user =:user and a.appId = :appid and awardtype =:ba")
    List<BadgeAward> findUserBadgeAwards(@Param("user") User user, @Param("appid") Long appId, @Param("ba") String ba);

    @Query("SELECT a fROM Award a WHERE a.user =:user and a.appId = :appid and awardtype =:pa")
    List<PointsAward> findUserPointAwards(@Param("user") User user, @Param("appid") Long appId, @Param("pa") String ba);

}
