/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ch.heigvd.gamification.api;

import ch.heigvd.gamification.api.dto.BadgeOutputDTO;
import ch.heigvd.gamification.api.dto.PointScaleOutputDTO;
import ch.heigvd.gamification.api.dto.PointScaleSummaryOutputDTO;
import ch.heigvd.gamification.api.dto.UserOutputDTO;
import ch.heigvd.gamification.model.Application;
import ch.heigvd.gamification.model.Award;
import ch.heigvd.gamification.model.Badge;
import ch.heigvd.gamification.model.BadgeAward;
import ch.heigvd.gamification.model.PointScale;
import ch.heigvd.gamification.model.PointsAward;
import ch.heigvd.gamification.model.User;
import ch.heigvd.gamification.services.ApplicationRepository;
import ch.heigvd.gamification.services.AwardRepository;
import ch.heigvd.gamification.services.TokenKeyTools;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Henneberger Sébastien, Pascal Sekley, Rodrigue Tchuensu, Franchini
 * Fabien
 * @version 1.0
 * @since 2016-11-14
 */
@RestController
@RequestMapping("/users")
public class UsersEndpoint implements UsersApi {

    private final HttpServletRequest request;
    private final ApplicationRepository applicationRepository;
    private final AwardRepository awardRepository;

    @Autowired
    UsersEndpoint(HttpServletRequest request, ApplicationRepository applicationRepository, AwardRepository awardRepository) {
        this.request = request;
        this.applicationRepository = applicationRepository;
        this.awardRepository = awardRepository;
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<UserOutputDTO>> usersGet(@RequestHeader("Authorization") String authenticationToken) {

        // Check if the JWT isn't valid
        if (!TokenKeyTools.jwtIsOk(authenticationToken)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Get the application id from the JWT
        long applicationId = TokenKeyTools.parseJWT(authenticationToken);

        // Get the existing application
        Application application = applicationRepository.findOne(applicationId);

        // If application was deleted but the authentication token wasn't removed
        if (application == null) {
            return new ResponseEntity<>(HttpStatus.GONE);
        }

        //Get the application users 
        List<User> appUsersList = application.getListUsers();

        //applicationRepository.findByApplication(application);
        //List<Award> userAwards;
        //Return the UsersOutputDTO
        List<UserOutputDTO> usersDTO = new ArrayList<>();
        List<BadgeOutputDTO> userBadgesDTO;
        List<PointScaleSummaryOutputDTO> userPointscalesDTO;
        List<BadgeAward> badgeAwards;
        List<PointsAward> pointAwards;

        for (int i = 0; i < appUsersList.size(); i++) {

            userBadgesDTO = new ArrayList<>();
            userPointscalesDTO = new ArrayList<>();

            badgeAwards = awardRepository.findUserBadgeAwards(appUsersList.get(i), application.getId(), "badgeaward");
            for (BadgeAward badgeAward : badgeAwards) {
                userBadgesDTO.add(toDTO(badgeAward.getBadge()));
            }

            pointAwards = awardRepository.findUserPointAwards(appUsersList.get(i), application.getId(), "pointaward");

            for (PointsAward pointAward : pointAwards) {
                userPointscalesDTO.add(toDTO(pointAward.getPointScale(), pointAward.getScore()));
            }
            usersDTO.add(i, toDTO(application.getId(), appUsersList.get(i), userBadgesDTO, userPointscalesDTO));
        }

        return new ResponseEntity<>(usersDTO, HttpStatus.OK);
    }

    @Override
    @RequestMapping(method = RequestMethod.GET, value = "/{id}")
    public ResponseEntity<UserOutputDTO> usersIdGet(@PathVariable("id") Long id, @RequestHeader("Authorization") String authenticationToken) {

        // Check if the JWT isn't valid
        if (!TokenKeyTools.jwtIsOk(authenticationToken)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Get the application id from the JWT
        long applicationId = TokenKeyTools.parseJWT(authenticationToken);

        // Get the existing application
        Application application = applicationRepository.findOne(applicationId);

        // If application was deleted but the authentication token wasn't removed
        if (application == null) {
            return new ResponseEntity<>(HttpStatus.GONE);
        }

        // Check if the desired user exists
        User user = null;
        for (User uzer : application.getListUsers()){
            if (uzer.getId().equals(id))
                user = uzer;
        }
        
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        System.out.println("userId: " + user.getId() +
                            "\n AppId: "+user.getAppId());

        // Return the user DTO
        UserOutputDTO userDTO;
        List<BadgeOutputDTO> userBadgesDTO = new ArrayList<>();
        List<PointScaleSummaryOutputDTO> userPointscalesDTO = new ArrayList<>();
        List<BadgeAward> badgeAwards;
        List<PointsAward> pointAwards;

        badgeAwards = awardRepository.findUserBadgeAwards(user, application.getId(), "badgeaward");
        badgeAwards.stream().forEach((badgeAward) -> {
            userBadgesDTO.add(toDTO(badgeAward.getBadge()));
        });

        pointAwards = awardRepository.findUserPointAwards(user, application.getId(), "pointaward");

        pointAwards.stream().forEach((pointAward) -> {
            userPointscalesDTO.add(toDTO(pointAward.getPointScale(), pointAward.getScore()));
        });
        userDTO = toDTO(application.getId(), user, userBadgesDTO, userPointscalesDTO);
        
        return new ResponseEntity<>(userDTO, HttpStatus.OK);

    }

    public UserOutputDTO toDTO(Long id, User user, List<BadgeOutputDTO> badgesOwned, List<PointScaleSummaryOutputDTO> pointScalesOwned) {
        UserOutputDTO dto = new UserOutputDTO();
        dto.setAppId(id);
        dto.setUserId(user.getId());
        dto.setUserIdApp(user.getUserIdApp());
        dto.setBagdesOwned(badgesOwned);
        dto.pointscalesOwned(pointScalesOwned);
        dto.setTotalScores(new Long(0));
         pointScalesOwned.stream().forEach((p) -> {
         dto.setTotalScores(dto.getTotalScores() + p.getScore() * p.getCoefficient());
      });

        return dto;
    }

    public BadgeOutputDTO toDTO(Badge badge) {
        BadgeOutputDTO dto = new BadgeOutputDTO();
        dto.setBadgeId(badge.getId());
        dto.setName(badge.getName());
        dto.setDescription(badge.getDescription());
        dto.setImageURL(badge.getImage());
        return dto;
    }

      public PointScaleSummaryOutputDTO toDTO(PointScale pointScale, long score) {
      PointScaleSummaryOutputDTO pointScaleDTO = new PointScaleSummaryOutputDTO();
      pointScaleDTO.setPointScaleId(pointScale.getId());
      pointScaleDTO.setName(pointScale.getName());
      pointScaleDTO.setCoefficient(pointScale.getCoefficient());
      pointScaleDTO.setScore(score);
      pointScaleDTO.setDescription(pointScale.getDescription());
      return pointScaleDTO;
   }

}
