package pet.care.petcare.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "clinicStaff_id", nullable = false)
    private ClinicStaff clinicStaff;

    private LocalDate date;  // Día específico del horario
    private LocalTime startTime = LocalTime.of(8, 0);
    private LocalTime endTime = LocalTime.of(21, 0);

    private boolean available = true; // Indica si el veterinario está disponible para el turno

    public void markUnavailable() {
        this.available = false;
    }
}
