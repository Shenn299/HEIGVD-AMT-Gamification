
package ch.heigvd.gamification.api;

import ch.heigvd.gamification.api.dto.LeaderBoardsAwardsOutputDTO;
import ch.heigvd.gamification.api.dto.LeaderBoardsBadgesOutputDTO;
import ch.heigvd.gamification.api.dto.LeaderBoardsPointscaleOutputDTO;
import ch.heigvd.gamification.api.dto.PointAwardOutputDTO;
import ch.heigvd.gamification.model.Application;
import ch.heigvd.gamification.model.BadgeAward;
import ch.heigvd.gamification.model.PointsAward;
import ch.heigvd.gamification.model.User;
import ch.heigvd.gamification.services.ApplicationRepository;
import ch.heigvd.gamification.services.AwardRepository;
import ch.heigvd.gamification.services.TokenKeyTools;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/leaderboards")
public class LeaderboardsEndpoint implements LeaderboardsApi { // Comparable<UserLeaderboardsOutputDTO>{

   private final HttpServletRequest request;
   private final ApplicationRepository applicationRepository;
   private final AwardRepository awardRepository;
   private int awardNumber;
   private int badgesNumber;
   private int pointscaleNumber;

   @Autowired
   LeaderboardsEndpoint(HttpServletRequest request, ApplicationRepository applicationRepository, AwardRepository awardRepository) {
      this.request = request;
      this.applicationRepository = applicationRepository;
      this.awardRepository = awardRepository;
   }

   @Override
   @RequestMapping(path = "/awards", method = RequestMethod.GET)
   public ResponseEntity<List<LeaderBoardsAwardsOutputDTO>> leaderboardsAwardsGet(@RequestHeader("Authorization") String authenticationToken) {
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
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

      //Get the application users 
      List<User> appUsersList = application.getListUsers();

      //returns the list of users sorted in order of decreasing awards earned.
      List<LeaderBoardsAwardsOutputDTO> awardLeaderboardDTO = new ArrayList<>();
      List<PointsAward> pointAwards;
      List<BadgeAward> badgeAwards;
      List<String> awardTypesAndNames;
      for (int i = 0; i < appUsersList.size(); i++) {
         awardTypesAndNames = new ArrayList<>();

         badgeAwards = awardRepository.findUserBadgeAwards(appUsersList.get(i), applicationId, "badgeaward");

         for (BadgeAward ba : badgeAwards) {
            awardTypesAndNames.add("BadgeAward -> name: " + ba.getBadge().getName());
         }

         pointAwards = awardRepository.findUserPointAwards(appUsersList.get(i), applicationId, "pointaward");

         for (PointsAward pa : pointAwards) {
            awardTypesAndNames.add("PointAwards -> name: " + pa.getPointScale().getName());
         }

         awardLeaderboardDTO.add(toDTO(appUsersList.get(i), applicationId, awardTypesAndNames));
      }

      Collections.sort(awardLeaderboardDTO, (LeaderBoardsAwardsOutputDTO u1, LeaderBoardsAwardsOutputDTO u2) -> {
         if (u1.getAwards().size() < u2.getAwards().size()) {
            return 1;
         }
         else if (u1.getAwards().size() > u2.getAwards().size()) {
            return -1;
         }
         else {
            return 0;
         }
      });
      return new ResponseEntity<>(awardLeaderboardDTO, HttpStatus.OK);

   }

   @Override
   @RequestMapping(path = "/badges", method = RequestMethod.GET)
   public ResponseEntity<List<LeaderBoardsBadgesOutputDTO>> leaderboardsBadgesGet(@RequestHeader("Authorization") String authenticationToken) {
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
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

      //Get the application users 
      List<User> appUsersList = application.getListUsers();

      List<String> awardTypesAndNames = new ArrayList<>();

      //returns the list of users sorted in order of decreasing awards earned.
      List<LeaderBoardsBadgesOutputDTO> badgesAwardLeaderboardDTO = new ArrayList<>();
      List<BadgeAward> badgeAwards;
      List<String> badgeNames;

      for (int i = 0; i < appUsersList.size(); i++) {
         badgeNames = new ArrayList<>();
         badgeAwards = awardRepository.findUserBadgeAwards(appUsersList.get(i), applicationId, "badgeaward");

         for (BadgeAward ba : badgeAwards) {
            badgeNames.add("name: " + ba.getBadge().getName());
         }

         badgesAwardLeaderboardDTO.add(toBadgesAwardDTO(appUsersList.get(i), applicationId, badgeNames));
      }

      Collections.sort(badgesAwardLeaderboardDTO, (LeaderBoardsBadgesOutputDTO u1, LeaderBoardsBadgesOutputDTO u2) -> {
         if (u1.getBadges().size() < u2.getBadges().size()) {
            return 1;
         }
         else if (u1.getBadges().size() > u2.getBadges().size()) {
            return -1;
         }
         else {
            return 0;
         }
      });

      return new ResponseEntity<>(badgesAwardLeaderboardDTO, HttpStatus.OK);
   }

   @Override
   @RequestMapping(path = "/pointScales", method = RequestMethod.GET)
   public ResponseEntity<List<LeaderBoardsPointscaleOutputDTO>> leaderboardsPointscaleGet(@RequestHeader("Authorization") String authenticationToken) {
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
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

      //Get the application users 
      List<User> appUsersList = application.getListUsers();

      //returns the list of users sorted in order of decreasing awards earned.
      List<LeaderBoardsAwardsOutputDTO> awardLeaderboardDTO = new ArrayList<>();
      List<PointsAward> pointAwards;
      List< PointAwardOutputDTO> pointAwardsDTO = new ArrayList<>();

      List<LeaderBoardsPointscaleOutputDTO> pointScaleLeaderboardsDTO = new ArrayList<>();
      for (int i = 0; i < appUsersList.size(); i++) {

         pointAwards = awardRepository.findUserPointAwards(appUsersList.get(i), applicationId, "pointaward");

         for (PointsAward pa : pointAwards) {
            pointAwardsDTO.add(toDTO(pa));
         }

         pointScaleLeaderboardsDTO.add(toPointAwardDTO(appUsersList.get(i), applicationId, pointAwardsDTO));
      }

      Collections.sort(pointScaleLeaderboardsDTO, (LeaderBoardsPointscaleOutputDTO u1, LeaderBoardsPointscaleOutputDTO u2) -> {
         if (u1.getTotalScores() < u2.getTotalScores()) {
            return 1;
         }
         else if (u1.getTotalScores() > u2.getTotalScores()) {
            return -1;
         }
         else {
            return 0;
         }
      });

      return new ResponseEntity<>(pointScaleLeaderboardsDTO, HttpStatus.OK);
   }

   public LeaderBoardsAwardsOutputDTO toDTO(User user, Long appID, List<String> awardTypesAndNames) {
      LeaderBoardsAwardsOutputDTO dto = new LeaderBoardsAwardsOutputDTO();
      dto.setAppId(appID);
      dto.setUserId(user.getId());
      dto.setUserIdApp(user.getUserIdApp());
      dto.setAwards(awardTypesAndNames);
      return dto;
   }

   public LeaderBoardsBadgesOutputDTO toBadgesAwardDTO(User user, Long appID, List<String> badgeNames) {
      LeaderBoardsBadgesOutputDTO dto = new LeaderBoardsBadgesOutputDTO();
      dto.setAppId(appID);
      dto.setUserId(user.getId());
      dto.setUserIdApp(user.getUserIdApp());
      dto.setBadges(badgeNames);
      return dto;
   }

   public PointAwardOutputDTO toDTO(PointsAward pointAward) {
      PointAwardOutputDTO dto = new PointAwardOutputDTO();
      dto.setCoefficient(pointAward.getPointScale().getCoefficient());
      dto.setName(pointAward.getPointScale().getName());
      dto.setScore(pointAward.getScore());
      return dto;
   }

   public LeaderBoardsPointscaleOutputDTO toPointAwardDTO(User user, Long appID, List<PointAwardOutputDTO> pa) {

      LeaderBoardsPointscaleOutputDTO dto = new LeaderBoardsPointscaleOutputDTO();
      dto.setAppId(appID);
      dto.setUserId(user.getId());
      dto.setUserIdApp(user.getUserIdApp());
      dto.setPointAwards(pa);
      dto.setTotalScores(new Long(0));

      pa.stream().forEach((p) -> {
         dto.setTotalScores(dto.getTotalScores() + p.getScore() * p.getCoefficient());
      });

      return dto;
   }

}
