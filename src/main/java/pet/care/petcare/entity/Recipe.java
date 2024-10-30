package pet.care.petcare.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "recipe")
public class Recipe implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
