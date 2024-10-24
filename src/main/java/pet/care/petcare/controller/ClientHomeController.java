package pet.care.petcare.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/client-panel")
public class ClientHomeController {

    @GetMapping("")
    @PreAuthorize("hasAuthority('CLIENT')")
    public String home(){
        return "indexClient";
    }

}
