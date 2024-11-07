package pet.care.petcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.Set;

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

    @ManyToMany
    @JoinTable(
            name = "treatments_diagnostics",
            joinColumns = @JoinColumn(name = "treatment_id"),
            inverseJoinColumns = @JoinColumn(name = "diagnostic_id")
    )
    private Set<Diagnostic> diagnostics;

}
