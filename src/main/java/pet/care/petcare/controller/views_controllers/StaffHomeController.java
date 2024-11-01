package pet.care.petcare.controller.views_controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
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
        return "pet";
    }

    @GetMapping("/diagnostics")
    @PreAuthorize("hasAuthority('CLINIC_STAFF')")
    public String diagnostic(){
        return "diagnostic";
    }

    @GetMapping("/medicalHistoryStaff")
    @PreAuthorize("hasAuthority('CLINIC_STAFF')")
    public String medicalHistoryStaff(){
        return "medicalHistoryStaff";
    }
}
