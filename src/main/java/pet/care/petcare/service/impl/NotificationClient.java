package pet.care.petcare.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pet.care.petcare.entity.Appointment;
import pet.care.petcare.entity.Client;
import pet.care.petcare.entity.Notification;
import pet.care.petcare.entity.Pet;
import pet.care.petcare.repository.IAppointmentRepository;
import pet.care.petcare.repository.INotificationRepository;
import pet.care.petcare.service.IClientService;

@Service
public class NotificationClient {

    @Autowired
    private INotificationRepository notificationRepository;

    @Autowired
    private IAppointmentRepository appointmentRepository;

    @Autowired
    private IClientService clientService;

    public void createNotifications(long clientId){
        List<Notification> allNotifications = new ArrayList<>();
        Client client = clientService.findById(clientId);
        for (Appointment appointment : getAllApointments(client)) {
            Notification notification = new Notification();
            notification.setUser(client);
            notification.setMessage("Your pet: " + appointment.getPet().getName() 
                        + " has an appointment with the veterinary: " 
                        + appointment.getClinicStaff().getName() 
                        + " " + appointment.getClinicStaff().getLastname()
                        + " on " + appointment.getDate()
                        + " from " + appointment.getStartTime() 
                        + " to " + appointment.getEndTime() + ".");
            allNotifications.add(notification);
        }
        notificationRepository.saveAll(allNotifications);

    }

    public List<Notification> getAllNotifications(Long clientId){
        Client client = clientService.findById(clientId);
        ArrayList<Notification> activeNotifications = new ArrayList<>();
        for(Notification notification: client.getNotificationList()){
            if(notification.getReadState()){
                activeNotifications.add(notification);
            }
        }
        return activeNotifications;
    }

    private List<Appointment> getAllApointments(Client client){
        ArrayList<Appointment> appointments = new ArrayList<>();
        for (Pet pet : client.getPets()) {
            appointments.addAll(appointmentRepository.findByPet_Id(pet.getId()));
        }
        return appointments;
    }

}
