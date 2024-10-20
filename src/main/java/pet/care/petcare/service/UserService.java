package pet.care.petcare.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import pet.care.petcare.entity.UserEntity;

public abstract class UserService<S extends UserEntity> implements ICRUDService<S> {
    protected BCryptPasswordEncoder cryptPasswordEncoder = new BCryptPasswordEncoder(12);

    protected void checkExistence(String username) throws RuntimeException{
        for (UserEntity users: findAll()){
            if(users.getUsername().equalsIgnoreCase(username)){
                throw new RuntimeException("Existing username");
            }
        }
    }
}