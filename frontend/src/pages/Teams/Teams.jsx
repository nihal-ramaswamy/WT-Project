import CancelIcon from '@material-ui/icons/Cancel';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import InfoIcon from '@material-ui/icons/Info';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { Col, Row } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import InfoModal from '../../components/Modal/InfoModal';
import RatingModal from '../../components/Modal/RatingModal';
import getConfig from "../../helpers/getConfig";
import { BASE_URL } from "../../shared/config";
import "./Teams.css";

function Teams() {
    let [value, setValue] = useState("");
    const userList = useSelector((state) => state.users.listOfUsers);
    // console.log(userList);
    const currentUser = useSelector((state) => state.user);
    const [currentId, setCurrentId] = useState(null);
    useEffect(() => {
      try {
        setCurrentId(currentUser.data._id)
        setCurSection('teammates');
      }
      catch {}
      }, [currentUser.data])


	const [cardUsers, setCards] = useState([]);
	useEffect(() => {
		setCards(userList);
		// console.log(userList);
	}, [userList]);

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [userInFocus, setUserInFocus] = useState(null);
    const [isRatingModalShown, showRatingModal] = useState(false);

    const teammatesRef = useRef(null);
    const oldTeammatesRef = useRef(null);
    const requestsRef = useRef(null);

    const [curSection, changeCurSection] = useState("teammates");

    const setCurSection = (sectionName) => {
		if (curSection === "teammates") {
			teammatesRef.current.className = "user-profile-nav-btn";
        }
        else if (curSection === "oldteammates") {
			oldTeammatesRef.current.className = "user-profile-nav-btn";
        }
        else if (curSection === "requests") {
			requestsRef.current.className = "user-profile-nav-btn";
        }

		changeCurSection(sectionName);

		if (sectionName === "teammates") {
			teammatesRef.current.className = "user-profile-nav-btn user-profile-nav-active";
        }
        else if (sectionName === "oldteammates") {
			oldTeammatesRef.current.className = "user-profile-nav-btn user-profile-nav-active";
        }
        else if (sectionName === "requests") {
			requestsRef.current.className = "user-profile-nav-btn user-profile-nav-active";
        }
	};

    const ReactToRequest = async (reaction, reactee) => {
        const response = await axios.post(`${BASE_URL}/api/teamder/reaction`, {
            id: reactee,
            reaction: reaction,
          },
          getConfig()
        )
        window.location.reload();
    }

    const TeammateStatus = async (reaction, reactee) => {
        const response = await axios.post(`${BASE_URL}/api/teamder/teammate`, {
            id: reactee,
            reaction: reaction,
          },
          getConfig()
        )
        window.location.reload();
    }

    const debugFunc = () => {
        console.log(cardUsers);
    }

	return currentUser.data && (
		<div className="user-profile-container">
            <div className="user-profile-nav-container">
                <button
                    ref={teammatesRef}
                    onClick={() => setCurSection("teammates")}
                    className="user-profile-nav-btn"
                    style={{cursor:'pointer'}}
                >
                    <div className="show-for-web"> Current Teammates </div>
                </button>
                <button
                    ref={oldTeammatesRef}
                    onClick={() => setCurSection("oldteammates")}
                    className="user-profile-nav-btn"
                    style={{cursor:'pointer'}}
                >
                    <div className="show-for-web"> Previous Teammates </div>
                </button>
                <button
                    ref={requestsRef}
                    onClick={() => setCurSection("requests")}
                    className="user-profile-nav-btn"
                    style={{cursor:'pointer'}}
                >
                    <div className="show-for-web"> Team Requests {currentUser.data.teamRequests.length > 0 && "("+String(currentUser.data.teamRequests.length)+")"} </div>
                </button>
            </div>
        <InfoModal isModalOpen={showInfoModal} toggleModal={()=>setShowInfoModal(!showInfoModal)} user={userInFocus} />
        <RatingModal isModalOpen={isRatingModalShown} toggleModal={()=>showRatingModal(!isRatingModalShown)} user={userInFocus} />
        {curSection === "requests" && currentUser.data.teamRequests.map((requester, index) => {
            const shownUser = userList.find(user => user._id === requester);
            return (
                <React.Fragment key = {"requests " + index}>
                    <Row>
                        <Col span={1}>
                            <InfoIcon 
                                onClick={()=>{
                                setUserInFocus(userList.find(user => user._id === requester));
                                setShowInfoModal(true)}}
                                style={{cursor:'pointer'}}
                            />
                        </Col>
                        <Col span={4}>
                            <a href={`/profile/${shownUser.username}`}>{shownUser.name.replace("_", "")}</a>
                        </Col>
                        <Col span={1}>
                            <CheckBoxIcon style={{cursor:'pointer'}} onClick={()=>ReactToRequest('yes', requester)}/>
                        </Col>
                        <Col span={1}>
                            <CancelIcon style={{cursor:'pointer'}} onClick={()=>ReactToRequest('no', requester)}/>
                        </Col>
                    </Row>
                    </React.Fragment>
            )
        })}
        {curSection === "teammates" && currentUser.data.matched.map((matchedUser, index) => {
            const shownUser = userList.find(user => user._id === matchedUser)
            return (
                <div key = {"teammates " + index}>
                <Row>
                    <Col span={1}>
                        <InfoIcon 
                        onClick={()=>{
                        setUserInFocus(userList.find(user => user._id === matchedUser));
                        setShowInfoModal(true)}}
                        style={{cursor:'pointer'}}
                        />
                    </Col>
                    <Col span={4}>
                        <a href={`/profile/${shownUser.username}`} className = "people">{shownUser.name.replace("_", "")}</a>
                    </Col>
                    <Col span={1}>
                        <DoneAllIcon style={{cursor:'pointer'}} onClick={()=>{
                            setUserInFocus(userList.find(user => user._id === matchedUser));
                            showRatingModal(true)}}/>
                    </Col>
                    <Col span={1}>
                        <RemoveCircleIcon style={{cursor:'pointer'}} onClick={()=>{TeammateStatus("stop", matchedUser)}}/>
                    </Col>
                    <hr />
                </Row>
                </div>
            )
        })}
        {curSection === "oldteammates" && currentUser.data.matchedBefore.map((matchedUser, index) => {
            const shownUser = userList.find(user => user._id === matchedUser)
            return (
                <div key = {"teammates " + index}>
                <Row>
                    <Col span={1}>
                        <InfoIcon 
                        onClick={()=>{
                        setUserInFocus(userList.find(user => user._id === matchedUser));
                        setShowInfoModal(true)}}
                        style={{cursor:'pointer'}}
                        />
                    </Col>
                    <Col span={4}>
                        <a href={`/profile/${shownUser.username}`} className = "people">{shownUser.name.replace("_", "")}</a>
                    </Col>
                    <hr />
                </Row>
                </div>
            )
        })}
		</div>
	);
}

export default Teams;
