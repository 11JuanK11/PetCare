package pet.care.petcare.controller;

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

}
