package pet.care.petcare.controller.views_controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/staff-panel")
public class StaffHomeController {

    @GetMapping("")
    @PreAuthorize("hasAuthority('CLINIC_STAFF')")
    public String home(){
        return "indexStaff";
    }

    @GetMapping("/pets")
    @PreAuthorize("hasAuthority('CLINIC_STAFF')")
    public String pet(){
        return "petVeterinary";
    }

    @GetMapping("/diagnostics")
    @PreAuthorize("hasAuthority('CLINIC_STAFF')")
    public String diagnostic(){
        return "diagnostic";
    }

    @GetMapping("/medicalHistoryStaff/{petId}")
    @PreAuthorize("hasAuthority('CLINIC_STAFF')")
    public String medicalHistoryStaff(@PathVariable Long petId, Model model){
        model.addAttribute("petId", petId);
        return "medicalHistoryStaff";
    }

    @GetMapping("/vaccineStaff/{petId}")
    @PreAuthorize("hasAuthority('CLINIC_STAFF')")
    public String vaccineStaff(@PathVariable Long petId, Model model){
        model.addAttribute("petId", petId);
        return "vaccineVeterinary";
    }



}
