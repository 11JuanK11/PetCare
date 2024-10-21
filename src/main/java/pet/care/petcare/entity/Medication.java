package pet.care.petcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
@Table(name = "medications")
public class Medication implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "The name is required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "The unit price is required")
    @Column(nullable = false)
    private Long unitPrice;

    @NotNull(message = "The stock is required")
    @Column(nullable = false)
    private Long stock;
}
