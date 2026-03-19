import {
  createServiceRequest,
  getUserRequests,
  getAllRequests,
  updateRequestStatus
} from "../models/service.model.js";
import { getAllVehicles } from "../models/inventory.model.js";

export async function showServiceForm(req, res, next) {
  try {
    const vehicles = await getAllVehicles();
    res.render("service/new", {
      title: "Request Service",
      vehicles
    });
  } catch (error) {
    next(error);
  }
}

export async function submitServiceRequest(req, res, next) {
  try {
    const vehicleId = req.body.vehicle_id || null;
    await createServiceRequest(
      req.session.user.user_id,
      vehicleId,
      req.body.service_type,
      req.body.description
    );

    res.redirect("/service/my-requests");
  } catch (error) {
    next(error);
  }
}

export async function showUserRequests(req, res, next) {
  try {
    const requests = await getUserRequests(req.session.user.user_id);

    res.render("service/my-request", {
      title: "My Service Requests",
      requests
    });
  } catch (error) {
    next(error);
  }
}

export async function showAllRequests(req, res, next) {
  try {
    const requests = await getAllRequests();

    res.render("admin/service", {
      title: "Manage Service Requests",
      requests
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req, res, next) {
  try {
    await updateRequestStatus(
      req.params.id,
      req.body.status,
      req.body.notes
    );

    res.redirect("/service/admin");
  } catch (error) {
    next(error);
  }
}