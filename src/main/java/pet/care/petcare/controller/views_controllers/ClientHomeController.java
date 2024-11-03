package pet.care.petcare.controller.views_controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import pet.care.petcare.entity.SecurityUser;

@Controller
@RequestMapping("/client-panel")
public class ClientHomeController {

    @GetMapping("")
    @PreAuthorize("hasAuthority('CLIENT')")
    public String home(Model model, @AuthenticationPrincipal SecurityUser userDetails){
        model.addAttribute("name", userDetails.getUser().getName() + " " + userDetails.getUser().getLastname());
        return "indexClient";
    }

    @GetMapping("/pets")
    @PreAuthorize("hasAuthority('CLIENT')")
    public String myPets(Model model, @AuthenticationPrincipal SecurityUser userDetails){
        model.addAttribute("userId", userDetails.getUser().getUserId());
        return "myPets";
    }

    @GetMapping("/pets/edit")
    @PreAuthorize("hasAuthority('CLIENT')")
    public String editMyPets(Model model, @AuthenticationPrincipal SecurityUser userDetails){
        model.addAttribute("userId", userDetails.getUser().getUserId());
        return "editPets";
    }
}
