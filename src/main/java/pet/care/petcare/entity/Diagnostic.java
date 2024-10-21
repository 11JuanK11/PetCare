package pet.care.petcare.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Entity
@Data
@Table(name = "diagnostic")
public class Diagnostic implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private String code;

    @OneToMany(mappedBy = "diagnostic", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Treatment> treatments;
}
