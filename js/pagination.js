/* 
 * ****************** 
 * pagination.js 사용법
 * ******************
 * 
 * 참고 html: /qa-evaluate/criteria/manageEvaluationGroup.html
 * 참고 js:   /qa-evaluate/criteria/manageEvaluationGroup.js
 * ----------------------------------------------------------------------
 * [초기화]
 * - pagination와 같이 import하는 다른 js파일에 초기화
 * - 다음 내용 복사/붙여넣기 해서 이용 가능
 * 
 * >>>> 핵심함수 
 * - Local_Page.attachDataToTable = function(data, index)		//오버로딩한 attachDataToTable 함수에 기능 구현
 * 
 * >>>> 예)
 * //테이블 페이지네이션 초기화
 * function initPagination() {
 *   //페이지네이션 상속
 *	 Local_Page = new GLOBAL_PAGINATION();
 *
 *	 // 사용하는 [객체 이름]과 각 항목이 표시될 [테이블의 id], pagination을 적용시킬 [page navigation id] 
 *	 Local_Page.setTableInfo('Local_Page', 'tableManageGroup', 'pageNavigation');
 *	
 *	 // 수신 데이터 테이블에 구현
 *	 Local_Page.attachDataToTable = function(data, index) {
 *	
 *		var html = "";
 *	
 *		html += '<tr id="group' + index + '">                                                                                                                   ';
 *		html += '	<td id="groupId">' + data.groupId + '</td>                                                   ';
 *		html += '</tr>                                                                                                                                     		';
 *		
 *		return html;
 *	 }
 * }
 * ----------------------------------------------------------------------
 * [테이블 데이터 저장 및 추출]
 * - ajax를 통한 response 데이터 저장
 * - 해당 데이터를 추출하고 pagination 기능 구현
 * - 다음 내용 복사/붙여넣기 해서 이용 가능 
 * 
 * >>>> 핵심함수 
 * - Local_Page.setPagination  //response 데이터 추출 및 pagination 기능 구현 함수
 * 
 * >>>> response 자료형태
 * List[Map<String, String>]
 * 
 * >>>> 예
 * 	$.ajax({
 *		url: "",
 *		type: "",
 *		success: function(response) {
 * 			//데이블 데이터 추출 및 pagination 기능 구현 함수
 * 			Local_Page.setPage(response);
 * 		},
 * 		error: function(error) {}
 * 	}) 
 * 
 */

/** ------------------------------------------------------------------------------------
 * [objects]
 * checkCountList				//테이블에 한번에 표시될 아이템 수
 * controlPagingDesign			//페이징 버튼 조작
 * controlPrevArrowDesign		//'<<', '<' 버튼 조작
 * controlNextArrowDesign		//'>', '>>' 버튼 디자인
 * setItemCntOnPage				//한 페이지에 표시되는 항목 개수 계산
 * setPagination				//response 데이터로부터 테이블 데이터 추출
 * onPageClick					//숫자 페이지 버튼 클릭
 * moveNextPage 				// '>' 버튼 클릭
 * moveLastPage					// ">>" 버튼 클릭
 * movePrevPage					// '<' 버튼 클릭
 * moveFirstPage 				// '<<' 버튼 클릭
 * -------------------------------------------------------------------------------------
 */

//페이지네이션 전역변수
function GLOBAL_PAGINATION() { }

/** 데이터 저장 함수 ------------------------------------------------------------------------- */
GLOBAL_PAGINATION.prototype.setTotalPageNum = function(totalPageNum) {
	this.totalPageNum = totalPageNum;
}
GLOBAL_PAGINATION.prototype.setCurrentPage = function(currentPage) {
	this.currentPage = currentPage;
}
GLOBAL_PAGINATION.prototype.setCountVal = function(countVal) {
	this.countVal = countVal;
}
GLOBAL_PAGINATION.prototype.setTableInfo = function(paramName, tableId, navId) {
	this.paramName = paramName;
	this.tableId = tableId;
	this.navId = navId;
}
GLOBAL_PAGINATION.prototype.setPage = function(dataList) {
	this.dataList = dataList
	this.setPagination();
	
	//첫번째 페이지로 이동
	this.currentPage = 1;

}
GLOBAL_PAGINATION.prototype.attachDataToTable = function(data, index) { }
/** ------------------------------------------------------------------------------------ */

// 변수 초기화
GLOBAL_PAGINATION.prototype.setTotalPageNum(1);		//페이지 개수
GLOBAL_PAGINATION.prototype.setCurrentPage(1);		//현재 페이지
GLOBAL_PAGINATION.prototype.setCountVal(10);      	//한 페이지에 표시되는 항목 개수

/**
  * 테이블에 한번에 표시될 아이템 수
  */
GLOBAL_PAGINATION.prototype.checkCountList = function() {
	this.countVal = $("#countList option:selected").val();
	this.currentPage = 1;
	this.setPagination();
}

/**
  * 페이징 버튼 조작
  */
GLOBAL_PAGINATION.prototype.controlPagingDesign = function() {
	////var PAGE = GLOBAL_PAGINATION[pageName];
	var totalPageNum = this.totalPageNum;
	var currentPage = this.currentPage;
	var pageParam = this.paramName;

	var html = "";
	html += this.controlPrevArrowDesign();
	//전체 페이지 수가 5페이지 이하일 경우
	if (totalPageNum <= 5) {
		for (var index = 1; index <= totalPageNum; index++) {
			if (index === currentPage) {
				html += '<li class="page-item active"><a class="page-link" href="#" onclick="' + pageParam + '.onPageClick(this)">' + index + '</a></li>';
			} else {
				html += '<li class="page-item"><a class="page-link" href="#" onclick="' + pageParam + '.onPageClick(this)">' + index + '</a></li>';
			}
		}
	} else if (totalPageNum > 5) {	//전체 페이지 수가 5페이지를 넘을 경우
		if (currentPage <= 3) {	//현재 페이지 위치가 왼쪽 끝에 위치할 경우
			for (var index = 1; index <= 5; index++) {
				if (index === currentPage) {
					html += '<li class="page-item active"><a class="page-link" href="#" onclick="' + pageParam + '.onPageClick(this)">' + index + '</a></li>';
				} else {
					html += '<li class="page-item"><a class="page-link" href="#" onclick="' + pageParam + '.onPageClick(this)">' + index + '</a></li>';
				}

			}
			html += '<li class="page-item"><a class="page-link" href="#" onclick="' + pageParam + '.onPageClick(this)">...</a></li>';
		} else if (currentPage >= totalPageNum - 2) {	////현재 페이지 위치가 오른쪽 끝에 위치할 경우
			html += '<li class="page-item"><a class="page-link" href="#" onclick="' + pageParam + '.onPageClick(this)">...</a></li>';
			for (var index = totalPageNum - 4; index <= totalPageNum; index++) {
				if (index === currentPage) {
					html += '<li class="page-item active"><a class="page-link" href="#" onclick="' + pageParam + '.onPageClick(this)">' + index + '</a></li>';
				} else {
					html += '<li class="page-item"><a class="page-link" href="#" onclick="' + pageParam + '.onPageClick(this)">' + index + '</a></li>';
				}
			}
		} else {	//페이지가 중앙쯤에 위치할 경우
			html += '<li class="page-item"><a class="page-link" href="#" onclick="onPageClick(this)">...</a></li>';
			for (var index = currentPage - 2; index <= currentPage + 2; index++) {
				if (index === currentPage) {
					html += '<li class="page-item active"><a class="page-link" href="#" onclick="' + pageParam + '.onPageClick(this)">' + index + '</a></li>';
				} else {
					html += '<li class="page-item"><a class="page-link" href="#" onclick="' + pageParam + '.onPageClick(this)">' + index + '</a></li>';
				}
			}
			html += '<li class="page-item"><a class="page-link" href="#" onclick="' + pageParam + '.onPageClick(this)">...</a></li>';
		}
	}
	//'>', '>>' 버튼 조작
	html += this.controlNextArrowDesign(pageParam);//pageName);
	var navId = this.navId
	var tagInfo = "#" + navId + " #pages";
	$(tagInfo).html(html);

}

//'<<', '<' 버튼 조작
GLOBAL_PAGINATION.prototype.controlPrevArrowDesign = function() {
	var pageParam = this.paramName;
	var currentPage = this.currentPage;

	var html = "";
	html += '<li class="page-item disabled" id="moveFirstPage"><a class="page-link" href="#" onclick="' + pageParam + '.moveFirstPage()">Page Previous</a></li>';
	html += '<li class="page-item disabled" id="movePrevPage"><a class="page-link" href="#" onclick="' + pageParam + '.movePrevPage()">Previous</a></li>';

	if (currentPage > 1) {
		html = "";
		html += '<li class="page-item" id="moveFirstPage"><a class="page-link" href="#" onclick="' + pageParam + '.moveFirstPage()">Page Previous</a></li>';
		html += '<li class="page-item" id="movePrevPage"><a class="page-link" href="#" onclick="' + pageParam + '.movePrevPage()">Previous</a></li>';
	}
	return html;
}

//'>', '>>' 버튼 조작
GLOBAL_PAGINATION.prototype.controlNextArrowDesign = function() {
	var pageParam = this.paramName;
	var totalPageNum = this.totalPageNum;
	var currentPage = this.currentPage;

	var html = "";
	html += '<li class="page-item disabled" id="moveNextPage"><a class="page-link" href="#" onclick="' + pageParam + '.moveNextPage()">Next</a></li>';
	html += '<li class="page-item disabled" id="moveLastPage"><a class="page-link" href="#" onclick="' + pageParam + '.moveLastPage()">Page Next</a></li>';

	if (currentPage <= totalPageNum - 1) {
		html = "";
		html += '<li class="page-item" id="moveNextPage"><a class="page-link" href="#" onclick="' + pageParam + '.moveNextPage()">Next</a></li>';
		html += '<li class="page-item" id="moveLastPage"><a class="page-link" href="#" onclick="' + pageParam + '.moveLastPage()">Page Next</a></li>';
	}

	return html;
}

/**
  * 한 페이지에 표시되는 항목 개수 계산
  */
GLOBAL_PAGINATION.prototype.setItemCntOnPage = function(dataCnt) {
	var countVal = this.countVal;
	var currentPage = this.currentPage;
	this.totalPageNum = Math.ceil(dataCnt / countVal);
	//페이지 표 가장 상단에 표시되는 그룹의 index 
	var startIndexInPage = (currentPage - 1) * countVal;

	//페이지 표 가장 하단에 표시되는 그룹의 index
	var lastIndexInPage = dataCnt;
	var length = startIndexInPage + countVal;
	if (lastIndexInPage > length) {
		lastIndexInPage = length;
	}
	return lastIndexInPage;

}

/**
  * response 데이터로부터 테이블 데이터 추출
  */
GLOBAL_PAGINATION.prototype.setPagination = function() {

	var dataList = this.dataList;
	var currentPage = this.currentPage;
	var countVal = this.countVal;
	//페이지 표 가장 상단에 표시되는 그룹의 index 
	var startIndexInPage = (currentPage - 1) * countVal;
	countVal *= 1;

	var tbody = "#" + this.tableId + " tbody";
	if (dataList.length === 0) {
		var html = "";
		html += '<tr class="nodata">										';
		html += '	<td class="no_result" colspan="7">평가그룹이 없습니다.</td>   ';
		html += '</tr>                                                      ';
		$(tbody).html(html);
		return;
	}

	//데이터 총개수
	var dataCnt = dataList.length;

	//페이지에 표시되는 항목 개수 설정
	var lastIndexInPage = this.setItemCntOnPage(dataCnt);
	//현재 항목 초기화
	$(tbody).html("");

	var html = ""
	//테이블에 데이터 삽입
	for (var i = startIndexInPage; i < lastIndexInPage; i++) {
		html += this.attachDataToTable(dataList[i], i);
	}

	var tableId = this.tableId;
	$("#" + tableId + " tbody").append(html);

	//페이지네이션 컨트롤
	this.controlPagingDesign();
}

//숫자 페이지 버튼 클릭
GLOBAL_PAGINATION.prototype.onPageClick = function(t) {
	//var PAGE = GLOBAL_PAGINATION[pageName];
	var clickedPageNum = t.text;
	if (clickedPageNum === "...") { return; }
	clickedPageNum *= 1;
	this.currentPage = clickedPageNum;
	this.setPagination();
}

// '>' 버튼 클릭
GLOBAL_PAGINATION.prototype.moveNextPage = function() {
	//var PAGE = GLOBAL_PAGINATION[pageName];
	if (this.totalPageNum > this.currentPage) {
		this.currentPage++;
		this.setPagination();
	}
}

// ">>" 버튼 클릭
GLOBAL_PAGINATION.prototype.moveLastPage = function() {
	//var PAGE = GLOBAL_PAGINATION[pageName];
	this.currentPage = this.totalPageNum;
	this.setPagination();
}

// '<' 버튼 클릭
GLOBAL_PAGINATION.prototype.movePrevPage = function() {
	if (1 < this.currentPage) {
		this.currentPage--;
		this.setPagination();
	}
}

// '<<' 버튼 클릭
GLOBAL_PAGINATION.prototype.moveFirstPage = function() {
	this.currentPage = 1;
	this.setPagination();
}

//테이블 데이터 리셋
GLOBAL_PAGINATION.prototype.resetTable = function() {
	var tbody = "#" + this.tableId + " tbody";
	console.log("tbody", tbody)
	var html = "";
	html += '<tr class="nodata">                                                 ';
	html += '	<td class="no_result" colspan="6">검색결과가 없습니다.</td>     		';
	html += '</tr>                                                               ';
	$(tbody).html(html);
}