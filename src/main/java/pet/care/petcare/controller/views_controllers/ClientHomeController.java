package pet.care.petcare.controller.views_controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import pet.care.petcare.entity.SecurityUser;
import pet.care.petcare.service.impl.NotificationClient;

@Controller
@RequestMapping("/client-panel")
public class ClientHomeController {

    @Autowired
    private NotificationClient notificationClient;

    @GetMapping("")
    @PreAuthorize("hasAuthority('CLIENT')")
    public String home(Model model, @AuthenticationPrincipal SecurityUser userDetails){
        model.addAttribute("name", userDetails.getUser().getName() + " " + userDetails.getUser().getLastname());
        model.addAttribute("notifications", notificationClient.getAllNotifications(userDetails.getUser().getUserId()));
        notificationClient.createRememberAppointment(userDetails.getUser().getUserId());
        model.addAttribute("reminder", notificationClient.getAllRemindersByClient(userDetails.getUser().getUserId()));
        return "indexClient";
    }

    @GetMapping("/pets")
    @PreAuthorize("hasAuthority('CLIENT')")
    public String myPets(Model model, @AuthenticationPrincipal SecurityUser userDetails){
        model.addAttribute("userId", userDetails.getUser().getUserId());
        model.addAttribute("notifications", notificationClient.getAllNotifications(userDetails.getUser().getUserId()));
        return "myPets";
    }

    @GetMapping("/pets/edit")
    @PreAuthorize("hasAuthority('CLIENT')")
    public String editMyPets(Model model, @AuthenticationPrincipal SecurityUser userDetails){
        model.addAttribute("userId", userDetails.getUser().getUserId());
        model.addAttribute("notifications", notificationClient.getAllNotifications(userDetails.getUser().getUserId()));
        return "editPets";
    }

    @GetMapping("/pets/medical-history")
    @PreAuthorize("hasAuthority('CLIENT')")
    public String medicalHistory(Model model, @AuthenticationPrincipal SecurityUser userDetails){
        model.addAttribute("userId", userDetails.getUser().getUserId());
        model.addAttribute("notifications", notificationClient.getAllNotifications(userDetails.getUser().getUserId()));
        return "medicalHistoryClient";
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasAuthority('CLIENT')")
    public String appointments(Model model, @AuthenticationPrincipal SecurityUser userDetails){
        model.addAttribute("userId", userDetails.getUser().getUserId());
        model.addAttribute("notifications", notificationClient.getAllNotifications(userDetails.getUser().getUserId()));
        return "appointments";
    }

    @GetMapping("/appointments/scheduleAppointment")
    @PreAuthorize("hasAuthority('CLIENT')")
    public String scheduleAppointment(Model model, @AuthenticationPrincipal SecurityUser userDetails){
        model.addAttribute("userId", userDetails.getUser().getUserId());
        model.addAttribute("notifications", notificationClient.getAllNotifications(userDetails.getUser().getUserId()));

        return "scheduleAppointment";
    }

    @GetMapping("/pets-recipes")
    @PreAuthorize("hasAuthority('CLIENT')")
    public String petsRecipes(Model model, @AuthenticationPrincipal SecurityUser userDetails){
        model.addAttribute("userId", userDetails.getUser().getUserId());
        model.addAttribute("notifications", notificationClient.getAllNotifications(userDetails.getUser().getUserId()));
        return "viewRecipeClient";
    }
}
