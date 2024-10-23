package pet.care.petcare.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "clinic_staff")
public class ClinicStaff extends UserEntity implements Serializable{

}
