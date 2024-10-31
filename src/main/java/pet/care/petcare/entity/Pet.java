package pet.care.petcare.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "The name is required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "The age is required")
    @Column(nullable = false)
    private Long age;

    @NotNull(message = "The race is required")
    @Column(nullable = false)
    private String race;

    @NotNull(message = "The weight is required")
    @Column(nullable = false)
    private Float weight;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private Client client;

}