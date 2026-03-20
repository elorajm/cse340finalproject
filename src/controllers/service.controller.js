import {
  createServiceRequest,
  getServiceRequestById,
  getUserRequests,
  getAllRequests,
  updateRequestStatus
} from "../models/service.model.js";

export async function showServiceForm(req, res, next) {
  try {
    res.render("service/new", { title: "Request Service" });
  } catch (error) {
    next(error);
  }
}

export async function submitServiceRequest(req, res, next) {
  try {
    const { car_year, car_make, car_model, service_type, other_service_type, description } = req.body;

    // Resolve "Other" to the custom text
    let finalServiceType = service_type ? service_type.trim() : "";
    if (finalServiceType === "Other") {
      const custom = other_service_type ? other_service_type.trim() : "";
      finalServiceType = custom || "Other";
    }

    if (!finalServiceType) {
      return res.status(400).render("service/new", {
        title: "Request Service",
        errors: [{ msg: "Please select a service type." }],
        old: req.body
      });
    }

    await createServiceRequest(
      req.session.user.user_id,
      car_year ? car_year.trim() : null,
      car_make ? car_make.trim() : null,
      car_model ? car_model.trim() : null,
      finalServiceType,
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
