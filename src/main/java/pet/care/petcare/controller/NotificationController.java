package pet.care.petcare.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.service.impl.NotificationClient;

@RestController
@RequestMapping("/rest/notifications")
public class NotificationController {

    @Autowired
    private NotificationClient notificationClient;

    @PostMapping("/{userId}")
    public ResponseEntity<?> createNotifications(@PathVariable Long userId) {
        try {
            notificationClient.createNotifications(userId);
            return ResponseEntity.ok("Exit");
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "An unexpected error occurred."));
        }
    }

    @PatchMapping("/{id}/mark-as-read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        Boolean readState = payload.get("readState");
        notificationClient.updateReadState(id, readState);
        return ResponseEntity.ok().build();
    }
}
