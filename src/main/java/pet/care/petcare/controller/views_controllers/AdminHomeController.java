package pet.care.petcare.controller.views_controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin-panel")
public class AdminHomeController {

    @GetMapping("")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String home(){
        return "indexAdmin";
    }

    @GetMapping("/medications")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String medicationsManagement(){
        return "medications";
    }

    @GetMapping("/medications/edit")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String editMedicationsManagement(){
        return "editMedication";
    }

    @GetMapping("/treatments")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String treatmentsManagement(){
        return "treatments";
    }

    @GetMapping("/treatments/edit")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String editTreatmentsManagement(){
        return "editTreatment";
    }

    @GetMapping("/clinic-staff")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String veterinaryManagement(){
        return "clinicStaff";
    }

    @GetMapping("/clinic-staff/edit")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String editVeterinaryManagement(){
        return "editClinicStaff";
    }

    @GetMapping("/createSchedule")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String scheduleManagement2(){
        return "createSchedule";
    }

    @GetMapping("/indexSchedule")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String scheduleManagement1(){
        return "indexSchedule";
    }

    @GetMapping("/viewWeeklySchedules")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String scheduleManagement3(){
        return "viewWeeklySchedules";
    }
}
