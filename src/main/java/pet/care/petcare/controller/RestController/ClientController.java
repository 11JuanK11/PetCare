package pet.care.petcare.controller.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pet.care.petcare.entity.Client;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.service.impl.ClientServiceImpl;

@RestController
@RequestMapping("/client")
public class ClientController {
    @Autowired
    private ClientServiceImpl clientService;

    @PostMapping("/")
    public ResponseEntity<?> insert(@RequestBody Client client) {
        try {
            clientService.insert(client);
            return new ResponseEntity<>("", HttpStatus.CREATED);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while creating the User.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
