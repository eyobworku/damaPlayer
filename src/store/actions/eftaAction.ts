// export const login = (loginData, authType) => async (dispatch) => {
//     const url =
//       authType === "super" ? requests.superAdminLogin : requests.adminLogin;
//     try {
//       dispatch({
//         type: ADMIN_LOGIN_REQUEST,
//       });
//       const { data } = await axios.post(url, loginData);
//       dispatch({
//         type: ADMIN_LOGIN_SUCCESS,
//         payload: data,
//       });
//       if (data.success) {
//         const expDate = new Date();
//         expDate.setHours(expDate.getHours() + 12);
//         cookies.set("swiftAdminToken", data.token, {
//           path: "/",
//           expires: expDate,
//           secure: true,
//         });

//         if (authType === "normal" && data.results) {
//           cookies.set("swiftAdminInfo", data.results, {
//             path: "/",
//             expires: expDate,
//             secure: true,
//           });
//         }

//         window.location.reload();
//       }
//     } catch (error) {
//       dispatch({
//         type: ADMIN_LOGIN_FAIL,
//         payload:
//           error.response && error.response.data.message
//             ? error.response.data.message
//             : error.message,
//       });
//     }
//   };
