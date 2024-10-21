package pet.care.petcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
@Table(name = "treatment")
public class Treatment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Treatment name cannot be null")
    private String name;

    @NotNull(message = "Treatment price cannot be null")
    private Integer price;

    @ManyToOne
    @JoinColumn(name = "diagnostic_id", nullable = false)
    @NotNull(message = "A valid diagnostic must be associated with the treatment")
    private Diagnostic diagnostic;
}
