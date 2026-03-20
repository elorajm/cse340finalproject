import {
  createServiceRequest,
  getServiceRequestById,
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
    const { vehicle_id, service_type, description } = req.body;

    if (!service_type || service_type.trim() === "") {
      const vehicles = await getAllVehicles();
      return res.status(400).render("service/new", {
        title: "Request Service",
        vehicles,
        errors: [{ msg: "Please select a service type." }],
        old: req.body
      });
    }

    const vehicleId = vehicle_id || null;
    await createServiceRequest(
      req.session.user.user_id,
      vehicleId,
      service_type.trim(),
      description ? description.trim() : null
    );

    req.flash("success", "Service request submitted. We'll be in touch soon!");
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

const VALID_STATUSES = ["Submitted", "In Progress", "Completed", "Cancelled"];

export async function updateStatus(req, res, next) {
  try {
    const request = await getServiceRequestById(req.params.id);
    if (!request) {
      const err = new Error("Service request not found.");
      err.status = 404;
      return next(err);
    }

    const status = req.body.status;
    if (!VALID_STATUSES.includes(status)) {
      req.flash("error", "Invalid status value.");
      return res.redirect("/service/admin");
    }

    await updateRequestStatus(
      req.params.id,
      status,
      req.body.notes
    );

    req.flash("success", "Service request updated.");
    res.redirect("/service/admin");
  } catch (error) {
    next(error);
  }
}
